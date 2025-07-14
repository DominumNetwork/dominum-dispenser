# BDFD Link Dispenser Bot Setup Guide

## Overview
This bot provides a link dispensing system with Firebase database integration, featuring free and premium tiers with different cooldown periods.

## Features
- **Link Dispenser**: Users can generate links with cooldowns (12h free, 4h premium)
- **Link Management**: Add and list links by category
- **User Tracking**: Reset individual or all user cooldowns
- **Firebase Integration**: Persistent storage for links
- **Logging**: All actions are logged to a designated channel

## Prerequisites
1. BDFD (Bot Designer for Discord) app
2. Firebase Realtime Database
3. Discord server with appropriate permissions

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Realtime Database
4. Set database rules to allow read/write (or configure more secure rules)

### 2. Get Firebase Credentials
1. Go to Project Settings → Service Accounts
2. Generate new private key or use existing credentials
3. Note your database URL and authentication token

### 3. Database Structure
Your Firebase database will automatically structure like this:
```
links/
  ├── category1/
  │   ├── uniqueID1: "https://example.com/link1"
  │   ├── uniqueID2: "https://example.com/link2"
  │   └── ...
  ├── category2/
  │   ├── uniqueID3: "https://example.com/link3"
  │   └── ...
  └── ...
```

## Bot Setup

### 1. Global Variables
Create these global variables in your BDFD bot:
```
$setGlobalUserVar[firebase_url;https://dominum-dispenser.firebaseio.com]
$setGlobalUserVar[firebase_token;Hj9oxDJwIlbFIesjoj8lfYkkeMEsVASpxIZsnpbI]
$setGlobalUserVar[premium_role_id;1353479809262424077]
$setGlobalUserVar[modlog_channel_id;1394085004098932736]
```

**Replace with your actual values:**
- `firebase_url`: Your Firebase database URL
- `firebase_token`: Your Firebase authentication token
- `premium_role_id`: Discord role ID for premium users
- `modlog_channel_id`: Channel ID for logging bot actions

### 2. Install Commands
Create these command files in your BDFD bot:

1. **dispenser.js** - Main link generation command
2. **add-link.bds** - Add links to database
3. **list-links.bds** - List all links in database
4. **reset-limit.bds** - Reset individual user cooldowns
5. **reset-all-limits.bds** - Reset all user cooldowns

### 3. Permissions Setup
Configure the following permissions:
- **Add Link**: `Manage Messages` permission
- **List Links**: `Manage Messages` permission
- **Reset Limit**: `Manage Messages` permission
- **Reset All Limits**: `Administrator` permission

## Command Usage

### `/dispenser <category>`
Generates a link from the specified category.
- **Free users**: 12-hour cooldown
- **Premium users**: 4-hour cooldown
- Links are sent via DM and removed from database

### `/add-link <category> <link>`
Adds a new link to the specified category.
- Requires `Manage Messages` permission
- Validates URL format
- Logs addition to mod channel

### `/list-links [category]`
Lists all links in the database.
- Without category: Shows overview of all categories
- With category: Shows up to 10 links from that category
- Requires `Manage Messages` permission

### `/reset-limit <user> [category]`
Resets dispenser cooldown for a specific user.
- Without category: Resets all categories for the user
- With category: Resets only that category
- Requires `Manage Messages` permission

### `/reset-all-limits <confirm>`
Resets dispenser cooldowns for ALL users.
- Requires `Administrator` permission
- Must confirm with `confirm:yes` parameter
- Cannot be undone

## User Experience

### Link Generation Process
1. User runs `/dispenser <category>`
2. Bot checks premium status and cooldown
3. If available, bot:
   - Selects random link from category
   - Sends link via DM
   - Deletes link from database
   - Sets cooldown period
   - Logs action

### Error Handling
- **Out of links**: Ephemeral message if category is empty
- **Cooldown active**: Shows remaining time until next generation
- **Invalid category**: Error if category doesn't exist
- **No DM permission**: Bot will inform user if DM fails

## Database Management

### Adding Links
- Use `/add-link` command or manually add via Firebase console
- Links are automatically assigned unique IDs
- Categories are created automatically when first link is added

### Monitoring Usage
- All actions are logged to the mod channel
- Track link generation, additions, and cooldown resets
- Monitor remaining links per category

## Troubleshooting

### Common Issues
1. **Firebase connection failed**: Check URL and token
2. **Permission errors**: Verify Discord role permissions
3. **Links not dispensing**: Check if category exists and has links
4. **Cooldown not working**: Verify user variable storage

### Error Messages
- **Database Error**: Firebase connection or authentication issue
- **Category Not Found**: Specified category doesn't exist
- **Out of Stock**: No links available in category
- **Invalid Link**: URL doesn't start with http:// or https://

## Security Considerations

### Firebase Security
- Use proper Firebase security rules
- Restrict database access to your bot only
- Keep authentication tokens secure

### Discord Permissions
- Limit command access to appropriate roles
- Monitor the mod log channel for suspicious activity
- Regularly review user permissions

## Maintenance

### Regular Tasks
- Monitor link inventory and restock as needed
- Clean up old cooldown data periodically
- Review logs for unusual activity
- Update Firebase security rules as needed

### Backup Strategy
- Export Firebase data regularly
- Keep backup of bot commands
- Document any customizations made

## Customization

### Cooldown Periods
Modify these lines in `dispenser.js`:
```
$let[cooldownTime;$if[$get[isPremium]==true;4h;12h]]
```

### Embed Colors
Change color codes in command files:
- `GREEN`: Success messages
- `RED`: Error messages
- `BLUE`: Information messages
- `YELLOW`: Warning messages

### Link Limits
Adjust how many links are shown in `/list-links`:
```
$for[j;0;$min[9;$sub[$get[categoryCount];1]]]
```

## Support
For issues or questions:
1. Check Firebase console for database errors
2. Review BDFD logs for command execution errors
3. Verify Discord permissions and role assignments
4. Test with a small number of links first

---

**Note**: This bot requires active Firebase and Discord API access. Ensure both services are properly configured before deployment.