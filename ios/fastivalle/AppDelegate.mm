#import "AppDelegate.h"

#import <Firebase/Firebase.h>

#import <React/RCTBundleURLProvider.h>
#import <GoogleSignIn/GoogleSignIn.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"Fastivalle";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
  return [GIDSignIn.sharedInstance handleURL:url];
}

- (NSURL *)bundleURL
{
#if DEBUG
  NSURL *url = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  // Fallback so the app never has "No bundle URL present" when Metro may not be configured yet
  if (url) return url;
  return [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios&dev=true&minify=false"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
