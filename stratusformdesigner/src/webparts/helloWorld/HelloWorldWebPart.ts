import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloWorldWebPart.module.scss';
import * as strings from 'HelloWorldWebPartStrings';
export interface IHelloWorldWebPartProps {
  description: string;
}
import * as $ from 'jquery';

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  public render(): void {
    require('jquery-ui-sortable');
    require("formBuilder");
    const formData = [
      {
        type: "header",
        subtype: "h1",
        label: "formBuilder in SPFx"
      },
      {
        type: "paragraph",
        label:
          "This is a demonstration of formBuilder running in an SPFx project."
      }
    ];

    $(document).ready(function(){   
      $('#fb-editor').formBuilder({formData});
    });

    this.domElement.innerHTML = `
      <div id="fb-editor" class="${ styles.helloWorld }">     
      </div>`;
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
