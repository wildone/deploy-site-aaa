# Deploy Site Template

A template for new GitHub pages site.

## Usage

Follow this guide to create a new GitHub pages site from this template. Install and configure Typerefinery to deploy the site to GitHub pages.

### Create a new repository from this template

1. Click the `Use this template` button on the github page.
2. Set the repository name and description.
3. Click the `Create repository from template` button.
4. Click the `Code` button and copy the HTTPS repository Url and save it.

### Create a personal access token

1. Go to the [Personal access tokens]() page.
2. Click the `Generate new token` button.
3. Set the token description.
4. Select the `repo` scope.
5. Click the `Generate token` button.
6. Copy the generated token and save it.

### Download and install Typerefinery

1. Go to the [Typerefinery Latest Release](https://github.com/typerefinery-ai/typerefinery/releases/latest) page.
In the Assets section, download the installer for your platform.
3. Install the app.
4. Run the app.
5. Wait for the app to finish setting up your services.
6. When you see Ready in the app, open a web browser and open CMS Homepage on [http://localhost:8113].

### Create new Site

1. In a web browser, open CMS Homepage on [http://localhost:8113](http://localhost:8113).
2. Login with the default credentials: `admin` and `admin`.
3. Click the `Create space` button and choose `Pages`.
4. Set the space `Title`, lowercase `Name`, and select `Typerefinery pages` in `Template`.
5. Click on the newly created space.

### Create new Space Config

1. Click `Create page` button.
2. On `Template selection` choose `Space Config` template.
3. On `Page properties` on `General` tab:
    * set the page `Title` to `Space Config`, and 
    * set `Name` to lowercase `_admin`.
4. On `Page properties` on `Deploy` tab:
    * select `Github` in `Deploy Target`, and
    * in `Additional Paths to Publish` add a new Path entry with `/apps/typerefinery/clientlibs`.
5. On `Page properties` on `Github` tab:
    * paste your repository Url into `Repository URL` in format `https://github.com/user/repo`.
    * paste your personal access token into `Personal Access Token`.
    * set the `Branch` to `gh-pages`.
    * set User and Email to your github user and email.
6. Return to CMS on [http://localhost:8113](http://localhost:8113).
7. On your new space click on the `...` button and select `Publish space`.
8. On `Publish space` dialog select `All` in `Publish Options`, click on `Deploy after Publish` toggle, and click `Publish` button.
9. Wait for the space to be published and deployed.
10. Check GitHub repository `gh-pages` branch for the new files.