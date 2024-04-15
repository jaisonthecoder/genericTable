# MgGenericListing

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Code scaffolding

Run `ng generate component component-name --project mg-generic-listing` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project mg-generic-listing`.
> Note: Don't forget to add `--project mg-generic-listing` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build mg-generic-listing` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build mg-generic-listing`, go to the dist folder `cd dist/mg-generic-listing` and run `npm publish`.

## Running unit tests

Run `ng test mg-generic-listing` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


### Development commands
1) Schematics project
 a) `npm pack`

2) Project to install schematics
  a) `npm i -D ./projects/@mg_core/atlp-module-generator-1.0.0.tgz`
  b) `ng g @mg_core/atlp-module-generator:atlp-module-generator`

### Replace Helpers example:

1. sample-service - <%=name %>
3. SampleService - <%=classify(name)%>


### Steps to install schematic inside a project

step 1 : Open terminal in root path

step 2 : execute `ng add @pcs/generic-listing`

step 3 : Enter module name that to be created , when we get prompt for 'What is the entity name?' : eg. ? What is the entity name? balance-sheet 

