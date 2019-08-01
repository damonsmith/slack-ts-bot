# Dev Setup

To run your own instance of your bot you've gotta go into the slack API and setup a new bot. Follow these instructions:

1. Go into slack apps: https://api.slack.com/apps and set up a new app called Yourname-Test-Bot (or whatever)
2. Go to OAuth & Permissions, scroll down to Scopes, and give it:

-   Send messages as Yourname-Test-TSBot
-   Post to specific channels in Slack
-   Add a bot user

3. Go to Bot Users and add a bot user with the default values
4. Go to Install App and select Install
5. In the following permissions page you can set the Post To to #your-bot-test-channel
6. Click Authorize
7. Then go up to the OAuth Access Token and copy the Bot User OAuth Access Token
8. Copy env.ts.j2 into a new file called env.ts and replace {{slack_token}} with your slack token
9. Save changes
10. run `yarn` to build the project

Now you are ready to run your very own tsbot test instance. In VSCode, go to debug and press play.

Then, go into slack #tsbot-test and you'll see that your bot integration has been added. Now invite your bot to join and
then mention it with `#yourtesttsbot help` and see if it responds.

## How to add more env settings for more services

You've gotta add all the secret settings into the ansible vault file, so install ansible.

1. get the tsbot vault password out of SSM in dev - /app/dev/tsbot/vault_password
2. `ansible-vault edit cicd/secret-config.yml` add your crap
3. add it to the template in env.ts.j2

It's cool to commit it because it's all encrypted.

## How does the tsbot deployment work?

(I really went to town with the weirdness on this one - Damon.)

Installation - It uses an AWS cloudformation (./cicd/cloudformatin.json) to provision the tsbot machine,
and to restart it if it fails, but the app updates are done by a cron job. There's no jenkins involved anywhere.

The cloudformation has a big init script that sets up the machine, checks out tsbot and starts it up, also
it adds a cron job that git pulls, and if there are any changes, updates and restarts.
