# BDFD Link Dispenser Bot - Command Summary

## Files Created

### 1. `dispenser.js` - Main Link Generation Command
- **Slash Command**: `/dispenser <category>`
- **Function**: Generates links with cooldown system
- **Features**:
  - Free users: 12-hour cooldown
  - Premium users: 4-hour cooldown
  - Sends link via DM
  - Removes link from database after generation
  - Logs all generations

### 2. `add-link.bds` - Add Link Command
- **Slash Command**: `/add-link <category> <link>`
- **Function**: Adds new links to Firebase database
- **Features**:
  - URL validation
  - Unique ID generation
  - Category auto-creation
  - Logging to mod channel

### 3. `list-links.bds` - List Links Command
- **Slash Command**: `/list-links [category]`
- **Function**: Displays database contents
- **Features**:
  - Overview of all categories (no parameter)
  - Detailed view of specific category
  - Shows up to 10 links per category
  - Link count statistics

### 4. `reset-limit.bds` - Reset Individual User Cooldown
- **Slash Command**: `/reset-limit <user> [category]`
- **Function**: Resets cooldown for specific user
- **Features**:
  - Single category reset (with parameter)
  - All categories reset (no parameter)
  - Cooldown status checking
  - Logging to mod channel

### 5. `reset-all-limits.bds` - Reset All User Cooldowns
- **Slash Command**: `/reset-all-limits <confirm>`
- **Function**: Mass reset of all user cooldowns
- **Features**:
  - Confirmation requirement (`confirm:yes`)
  - Administrator permission required
  - Comprehensive user tracking reset
  - Detailed logging

### 6. `SETUP_GUIDE.md` - Complete Setup Documentation
- Firebase setup instructions
- Bot configuration guide
- Command usage examples
- Troubleshooting guide
- Security considerations

## Quick Setup Checklist

1. **Firebase Setup**:
   - Create Firebase project
   - Enable Realtime Database
   - Get database URL and auth token

2. **Bot Configuration**:
   - Set global variables in BDFD
   - Create all command files
   - Configure permissions

3. **Testing**:
   - Add test links with `/add-link`
   - Test link generation with `/dispenser`
   - Verify cooldown system works

## Global Variables Required
```
$setGlobalUserVar[firebase_url;https://dominum-dispenser.firebaseio.com]
$setGlobalUserVar[firebase_token;Hj9oxDJwIlbFIesjoj8lfYkkeMEsVASpxIZsnpbI]
$setGlobalUserVar[premium_role_id;1353479809262424077]
$setGlobalUserVar[modlog_channel_id;1394085004098932736]
```

## Permission Requirements
- **Basic Users**: Can use `/dispenser`
- **Manage Messages**: Can use `/add-link`, `/list-links`, `/reset-limit`
- **Administrator**: Can use `/reset-all-limits`

## Key Features
- ✅ Firebase database integration
- ✅ Premium/free tier system
- ✅ Automatic link deletion after use
- ✅ Comprehensive logging
- ✅ User cooldown tracking
- ✅ Category-based organization
- ✅ DM delivery system
- ✅ Error handling and validation

## Database Structure
```
links/
├── category1/
│   ├── uniqueID1: "https://example.com/link1"
│   └── uniqueID2: "https://example.com/link2"
├── category2/
│   └── uniqueID3: "https://example.com/link3"
└── ...
```

All commands are ready to use with the provided Firebase credentials and Discord IDs!