
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface JQuery {
  (selector: string): JQuery;
  formBuilder(optionsOrMethod: string | object, options?: any): any;
}
