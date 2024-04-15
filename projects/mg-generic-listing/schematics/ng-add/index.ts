import { Rule, Tree, SchematicContext, SchematicsException } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { applyToUpdateRecorder } from '@schematics/angular/utility/change';
import { addImportToModule } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
        context.logger.info('Adding library modules..');
        const modulePath = "/src/app/app.module.ts";
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

        context.logger.info(" text path ==> " + text.toString());
    
        const source = ts.createSourceFile(
            modulePath, text.toString(), ts.ScriptTarget.Latest, true
        )

        applyToUpdateRecorder(recorder,
            addImportToModule(source, modulePath, 'MgGenericListingModule', '@pcs/generic-listing')
        );
        tree.commitUpdate(recorder);
        }
        context.logger.info('Installing Dependencies...');
        context.addTask(new NodePackageInstallTask())
        return tree;
    }
}