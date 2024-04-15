import { Rule, apply, url, applyTemplates, move, chain, mergeWith , Tree, SchematicContext, SchematicsException} from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { GenericListingComponentSchema } from './generic-list-component';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';

export function genericListingComponentGenerator(options: GenericListingComponentSchema): Rule {
    return () => {
          const templateSource = apply(
             url('./files'), [
                applyTemplates({
                    classify:strings.classify,
                    dasherize: strings.dasherize,
                    name: options.name,
                    serviceCode: options.serviceCode,
                    importPath: options.importPath
                }),
                move(normalize(`/${options.path}/${strings.dasherize(options.name)}`))
             ]
          )

          return chain([
            mergeWith(templateSource),
            installRequiredPackages(options)
          ]);
    }

}


function installRequiredPackages(options: GenericListingComponentSchema): Rule {
    return (tree: Tree, context: SchematicContext) => {

        context.logger.info('Installing Dependencies...');
        context.addTask(new NodePackageInstallTask());


        context.logger.info('Adding library modules..');
        const modulePath =  options.importPath? options.importPath :  "/src/app/app.module.ts";
        if (!tree.exists(modulePath)) {
            throw new SchematicsException(`the file ${modulePath} doesn't exists !!`);
        }

        if( ts && ts.createSourceFile){
        const recorder = tree.beginUpdate(modulePath);
        //tree.commitUpdate(recorder);

        const text = tree.read(modulePath);
        if (text === null) {
            throw new SchematicsException(`the file ${modulePath} doesn't exists !!`);
        }

    
        const source = ts.createSourceFile(
            modulePath, text.toString(), ts.ScriptTarget.Latest, true
        )
        
        const moduleImportPath = options.importPath? `./${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.module` :`./${strings.dasherize(options.name)}/${strings.dasherize(options.name)}.module`;

        applyToUpdateRecorder(recorder,
            addImportToModule(source, modulePath, `${strings.classify(options.name)}Module`, moduleImportPath)
        );
        context.logger.info('Importing your template module succeeded.');
        tree.commitUpdate(recorder);
        }
     

        return tree;
    }

}