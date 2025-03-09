const { notarize } = require('@electron/notarize');

exports.default = async function notarizeApp(context) {
  const { electronPlatformName, appOutDir } = context;

  // Only notarize for macOS
  if (electronPlatformName !== 'darwin') {
    console.log('Skipping notarization for non-macOS platform.');
    return;
  }

  console.log('Starting notarization...');
  const appName = context.packager.appInfo.productFilename;

  try {
    await notarize({
      appBundleId: 'com.electron.app', // Replace with your app's bundle ID
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID, // Set your Apple ID in the environment variable
      appleIdPassword: process.env.APPLE_ID_PASSWORD, // Use app-specific password
      teamId: process.env.APPLE_TEAM_ID, // Optional: Team ID for notarization
    });
    console.log('Notarization successful.');
  } catch (error) {
    console.error('Failed to notarize app:', error);
    throw error;
  }
};
