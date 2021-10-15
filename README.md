# Profile Manager Google Workspace Add-on
A Google Workspace Add-on that enables users to modify how their name is displayed in the Directory without requiring administrator intervention. Google's Workspace Directory doesn't provide a mechanism for users to add pronouns or change their displayed name. This project employs the [`gender.addressMeAs`](https://developers.google.com/admin-sdk/directory/reference/rest/v1/users#User.FIELDS.gender) field to store the user's pronouns allowing other name syncronization systems to reliably extract and overwrite the legal name parts as required.

## Prerequisites
- Apps Script project using a [Standard Google Cloud Platform project](https://developers.google.com/apps-script/guides/cloud-platform-projects#standard_cloud_platform_projects).
- Service account in Google Cloud with [domain-wide delegation](https://developers.google.com/admin-sdk/directory/v1/guides/delegation) enabled.
  - Google Workspace administrator account to delegate Admin API requests
- Sufficient icons, screenshots, URLs, and email addresses in order to create a Google Workspace Marketplace [store listing](https://developers.google.com/workspace/marketplace/create-listing).

## Set up
1. Copy the files in this repository into an Apps Script project.
2. Change all environment-specific values (noted with `< >`) as necessary
   - `<Logo URL>`, `<Service Desk URL prefix>` in `appsscript.json` and `Code.js`
   - `<Documentation URL>` in `Code.js`
   - `<Admin Account Email Address>` in `ServiceAccount.js`
4. Copy the Google Cloud service account private key json file into the project as a [new `Script` file](https://developers.google.com/apps-script/guides/projects#creating_a_file)
5. [Publish the add-on](https://developers.google.com/apps-script/add-ons/how-tos/publish-add-on-overview) to the Marketplace
6. [Install the Marketplace add-on](https://support.google.com/a/answer/172482) in your domain
