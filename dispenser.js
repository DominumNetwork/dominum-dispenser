$nomention
$onlyIf[$getSlashCommandOptions[category]!=;{color:RED}{title:❌ Error}{description:Please specify a category to generate a link from!}]

$c[Check if user has premium role]
$let[isPremium;$hasRole[$authorID;$getGlobalUserVar[premium_role_id]]]

$c[Set cooldown based on premium status]
$let[cooldownTime;$if[$get[isPremium]==true;4h;12h]]
$let[cooldownKey;dispenser_$authorID_$getSlashCommandOptions[category]]

$c[Check cooldown]
$onlyIf[$getUserVar[$get[cooldownKey]]<$dateStamp;{color:RED}{title:⏰ Cooldown Active}{description:You can generate another link in <t:$getUserVar[$get[cooldownKey]]:R>!}]

$c[Get links from Firebase]
$httpRequest[https://dominum-dispenser.firebaseio.com/links/$getSlashCommandOptions[category].json?auth=$getGlobalUserVar[firebase_token];GET;;firebase_response;{
  "content-type": "application/json"
}]

$c[Check if category exists and has links]
$onlyIf[$httpResult[firebase_response]!=null;{color:RED}{title:❌ Category Not Found}{description:The category `$getSlashCommandOptions[category]` doesn't exist or has no links available!}]

$c[Parse Firebase response and get random link]
$let[linksData;$httpResult[firebase_response]]
$let[linkKeys;$objectKeys[$get[linksData]]]
$let[totalLinks;$arrayLength[$get[linkKeys]]]

$onlyIf[$get[totalLinks]>0;{color:RED}{title:❌ Out of Stock}{description:Sorry, we are out of links for this category. Please wait for a restock!}]

$c[Get random link]
$let[randomIndex;$random[0;$sub[$get[totalLinks];1]]]
$let[selectedKey;$arrayAt[$get[linkKeys];$get[randomIndex]]]
$let[selectedLink;$objectProperty[$get[linksData];$get[selectedKey]]]

$c[Send link via DM]
$sendDM[$authorID;{color:GREEN}{title:🎉 Link Generated!}{description:**Category:** $getSlashCommandOptions[category]
**Link:** $get[selectedLink]
**Type:** $if[$get[isPremium]==true;Premium (4h cooldown);Free (12h cooldown)]}{footer:Generated from $serverName}{timestamp}]

$c[Delete link from Firebase]
$httpRequest[https://dominum-dispenser.firebaseio.com/links/$getSlashCommandOptions[category]/$get[selectedKey].json?auth=$getGlobalUserVar[firebase_token];DELETE;;delete_response;{
  "content-type": "application/json"
}]

$c[Set cooldown]
$setUserVar[$get[cooldownKey];$sum[$dateStamp;$replaceText[$replaceText[$get[cooldownTime];h;*3600];m;*60]]]

$c[Track user for reset functionality]
$let[currentUsers;$getServerVar[dispenser_users_$getSlashCommandOptions[category]]]
$if[$checkContains[$get[currentUsers];$authorID]==false]
  $setServerVar[dispenser_users_$getSlashCommandOptions[category];$get[currentUsers],$authorID]
$endif

$let[recentUsers;$getServerVar[recent_dispenser_users]]
$if[$checkContains[$get[recentUsers];$authorID]==false]
  $setServerVar[recent_dispenser_users;$get[recentUsers],$authorID]
$endif

$c[Log generation]
$channelSendMessage[$getGlobalUserVar[modlog_channel_id];{color:BLUE}{title:📤 Link Generated}{description:**User:** <@$authorID> (`$authorID`)
**Category:** $getSlashCommandOptions[category]
**Type:** $if[$get[isPremium]==true;Premium;Free]
**Remaining Links:** $sub[$get[totalLinks];1]}{timestamp}]

$c[Confirm to user]
{color:GREEN}{title:✅ Link Sent!}{description:I've sent you a link from the `$getSlashCommandOptions[category]` category via DM!
**Type:** $if[$get[isPremium]==true;Premium (4h cooldown);Free (12h cooldown)]
**Next Generation:** <t:$getUserVar[$get[cooldownKey]]:R>}

$createSlashCommand[dispenser;Generate a link from the database;category:The category to generate from:true:3]