import { DefautReactComponent } from 'types/react';

export abstract class Component {
  public constructor(public readonly root: Selector) { }
  public async getRootComponent(): Promise<DefautReactComponent> {
    return await this.root.getReact<DefautReactComponent>();
  }
}
