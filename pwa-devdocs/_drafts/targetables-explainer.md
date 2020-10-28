# Targetables: Fluent tools for making your code extensible with Targets

Targetables are handy objects which represent source files in your project or library. When paired with Buildpack Targets, Targetables make it simple to customize PWA modules on the fly.

## Introduction

You need a lot of Targets to make a PWA Studio project powerfully extensible. Enhancing the storefront through Targets means changing source code in highly specific ways during the build process. A Targetable for a source file provides methods for making pinpoint changes to the code in that file.

```js
targetables.esModule('@my/library/Button.js', {
  publish() {
    const focusClasses = this
      .addImport('focusClasses from "src/a11y/focus-classes.css"');

    this
      .setJSXProps('<button>', { tabIndex: '0' })
      .addJSXClassName('<button>', `${focusClasses}.focusRing`)
  }
})
```

The above code modifies the source of `Button.js` right before Webpack pulls it into the build. It's always on the fly, never saving those changes to `Button.js` on disk.

If you're working on a PWA project, you can use Targetables in your local intercept file to make modifications like this to _any file_ in your dependencies. 

If you're working on a PWA extension, Buildpack restricts your intercepts so they can only modify files in your own extension package. But Targetables are still really useful in your extension! You can add Targets to permit third-party intercepts of your own extension, and implement them concisely with Targetables.

```js
targetables.reactComponent('@my/library/Button.js', {
  async publish(myTargets) {
    const classnames = await myTargets.buttonClassnames.promise([]);
    classnames.forEach(name => this.addJSXClassName('<button>', name));
  }
});
```

The above code combines the `TargetableReactComponent` with a declared target `buttonClassnames`: it calls interceptors which contribute to an array of class names, and then it uses JSX manipulation methods to add each of those class names to a `<button>` element in the code.

Those six lines of code are a _full implementation_ of a useful extension point for `@my/library`: third parties can now intercept the `buttonClassnames` target to add styling to buttons rendered by `@my/library/Button.js`.

## Usage

Targetables are useful in two types of scenario:

- An **extension developer** can use Targetables to implement Targets for her own extension
- A **site developer** can use Targetables to tweak files in any of his project's dependencies

### Example: Extension Development

Cathy maintains an extension `@example/pwa-nav`, which inserts a navigation bar into the PWA header.

**@example/pwa-nav/navBar.js**
```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './icon'

export default function NavBar() {
  return (
    <nav className="nav-overlay">
      <Link to="/">
        <Icon src={Icon.Home}>Home</Icon>
      </Link>
      <Link to="/cart">
        <Icon src={Icon.Cart}>Cart</Icon>
      </Link>
    </nav>
  )
}
```

Freddy is developing a support chat plugin for PWA Studio, `@freddy/pwa-chat`.
It depends on `@example/pwa-nav`, using its `navBar` Target to add the Chat button to the UI.

Cathy's module `@example/pwa-nav` declares and implements a `navBar` target. But what API does that target expose to interceptors?

It could pass the literal source code, leaving it open for interceptors to modify and return.

![targetable-example-bad](https://user-images.githubusercontent.com/1643758/95424098-c46f9480-0907-11eb-8670-ec5437594722.jpg)

But this is not very friendly, or very safe! It allows Freddy's module to manipulate source code in ways that Cathy's module won't expect. In effect, this makes the entire source of `navBar.js` into public API. It's hard to maintain!

However, Cathy wants `navBar` to restrict changes to simply adding new navigation items. So in her intercept file, she uses a `TargetableReactComponent` on her own module, and only allows interceptors to pass a configuration object for new nav items; Cathy's code will take care of the rest.

![targetable-example-good](https://user-images.githubusercontent.com/1643758/95424624-86bf3b80-0908-11eb-8b62-e813af73bb39.jpg)

Cathy might implement this more limited API like this:

**@example/pwa-nav/intercept.js**
```js
const { Targetables } = require('@magento/pwa-buildpack');
module.exports = function intercept(targets) {
  const targetables = Targetables.using(targets);

  targetable.reactComponent('@example/pwa-nav/Nav.js', {
    publish(myTargets, self) {
      const navBarAPI = {
        addItem(label, to, iconPath) {
          const icon = self.addImport('NewIcon from "${iconPath}"');
          self.appendJSX('nav', `<Link to="${to}"><Icon src={${icon}}>${label}</Icon></Link>`)
        }
      }

      myTargets.navBar.call(navBarAPI);
    }
  })
}
```

Now, Freddy's module can add nav items using a higher-level concept:

**@freddy/pwa-chat/intercept.js**
```js
module.exports = targets => {
  targets.of('@example/pwa-nav').navBar.tap(bar => {
    bar.addItem('Chat', '/chat', "./path/to/icon.svg")
  });
}
```

The above code in `@example/pwa-nav/intercept.js:` does the following:

1. Creates a Targetables factory that is connected to the TargetProvider sent to the intercept file. This factory knows how to use builtin Targets to automatically intercept the build process.

1. Creates a `TargetableReactComponent`, which has methods for JSX and React-specific tweaks, representing the `Nav.js` file.

1. Provides a "publisher" callback, which will run right before build.

1. When a build begins, the `targetables` object intercepts `builtins.transformModules` behind the scenes. Inside that intercept, it runs the `publish()` method on this Targetable, passing it `@example/pwa-nav`'s own targets (and a copy of itself, for when `this` is unavailable).

1. The `publish()` method creates the simple, abstract API to replace direct access to the source code. The API object has one method, `addItem(label, to, icon)`, which is the only thing that interceptors can do.

1. The `publish()` method then sends this API to all interceptors when it calls its own `navBar` target!

1. Now, the interceptor in `@freddy/pwa-chat/intercept.js` runs. It calls `navBarAPI.addItem()` with the parameters for its Chat icon.

1. Inside that method, the `TargetableReactComponent` inserts an import statement to get the provided icon, and then appends a `<Link />` element to the component source.

1. The `TargetableReactComponent` translates those method calls into `TransformRequest` objects which tell Webpack how to make those changes. It holds them in a queue.

1. After the `publish()` method runs, the Targetable factory does the rest in the background. It calls `.flush()` on the `TargetableReactComponent`, which returns an array of TransformRequest objects representing the requested changes to `Nav.js`.
   
1. The TargetableFactory sends each TransformRequest to its `transformModules` interceptor.

1. The build continues. When it reaches `Nav.js`, it runs the TransformRequests for that module, and changes its code during the load phase.

There are many other ways to use Targetables as an extension developer, but the above is the "happy path" workflow.

### Example: Project Customization

Marco is building a PWA for a merchant based in India. The merchant needs to use a third party contact form component required by their parent company, `@parent-company/contactform`'. Unfortunately, the form includes a telephone number field which doesn't recognize Indian phone numbers, which can be 8 to 10 digits long.

**@parent-company/contactform/index.js**
```jsx
const phoneValidation = "[0-9]{3}-[0-9]{3}-[0-9]{4}";
const phoneField = (
  <input
    type="tel"
    name="phone"
    pattern={phoneValidation}
    required />
);
```

The merchant wants to:
1. Fix the validation to allow only Indian phone numbers.
2. Make the phone number optional.

The `@parent-company/contactform` component hardcodes this validation and it can't be changed with configuration. But Marco can fix it with Targetables!

Marco makes a local intercept file in his project root directory. He makes sure to add it in his `package.json`:

**package.json**
```diff
+ "pwa-studio": {
+   "targets": {
+     "intercept": "local-customizations.js"
+   }
+ }
}
```

**local-customizations.js**
```js
const { Targetables } = require('@magento/pwa-buildpack');

module.exports = function intercept(targets) {
  const targetables = Targetables.using(targets);
  
  const contactForm = targetables.reactComponent("@parent-company/contactform/index.js", () => {
      contactForm.insertAfterSource('const phoneValidation = "', '[0-9]{8,10}', { remove: 26 });
      contactForm.removeJSXProps('<input name="phone">', ['required']);
    }
  });
};
```

The above code does the following:

1. Creates a Targetables factory that is connected to the TargetProvider.

1. Creates a `TargetableReactComponent` representing the `@parent-company/contactform/index.js` file. In an extension, the build process would fail here; dependencies are not allowed to transform files from other dependencies. But because this is a local intercept in the project file, a Targetable can change anything!

1. Passes a "publisher" callback. This example uses a simple variant of the method signature, passing a callback function instead of an object with a `publish()` method.

1. When the callback runs, it makes two changes to the component. First, it inserts a new pattern into the string literal assigned to `phoneValidation`, and removes the 26 characters of the old validation pattern.

1. Second, it finds the first `input` element in the file that has a `name` property set to `"phone"`--which is the phone number input! It then removes the `required` prop from the JSX code.

Marco has updated the contact form functionality without having to fork the dependency code itself.

This customization may fail after upgrading to a new version of `@parent-company/contactform/index.js`. When customizing a dependency like this, Marco should set its semver string in `package.json` to a single version.

### Utility methods

Extensions frequently need to tap other builtin targets to configure the build. The `Targetables` object has some convenience methods to reduce that boilerplate.

#### `targetables.setSpecialFeatures()`

Extensions with special files, like ES Modules, CSS Modules, GraphQL queries, and others, need to set feature flags in the build so their code is loaded correctly. To do this, they must tap the builtin `specialFeatures` target.

Example:
```js
targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
  features[targets.name] = {
    esModules: true,
    graphqlQueries: true,
    upward: true
  };
});
```

Alternatively, the `targetables.setSpecialFeatures()` will create that interceptor itself, with a more concise call:

```js
targetables.setSpecialFeatures('esModules', 'graphqlQueries', 'upward');
```

This method also accepts an array of flag names, a flags object with boolean values, or a mixture of these as arguments.

#### `targetables.defineEnvVars()`

Extensions may have their own environment configuration settings to add to the project. To do this, they must tap the builtin `envVarDefinitions` target.

Example:
```js
targets.of('@magento/pwa-buildpack').envVarDefinitions.tap(defs => {
  defs.sections.push({
    name: 'Support Chat',
    variables: [
      {
        name: 'SUPPORT_CHAT_API_KEY',
        type: 'str',
        desc: 'API key for the chat service'
      }
    ]
  })
});
```

The `targetables.defineEnvVars()` method can do the equivalent:

```js
targetables.defineEnvVars('Support Chat', [{
  name: 'SUPPORT_CHAT_API_KEY',
  type: 'str',
  desc: 'API key for the chat service'
}])
```

### Other usage patterns

The `Targetables` factory is convenient for adding TransformModuleRequests to the build, which is the most common use case for Targetables. But Targetables can also be used by themselves, and manually added to the build.

Example:
```js
// Create an unbound Targetable.
const handlers = new Targetables.ESModule('src/lib/handlers.js');

// Wrap an export in a decorator from another file.
handlers.wrapWithFile('handleLoad', 'src/overrides/doSomethingOnLoad.js');

// Send it all to the build.
targets.of('@magento/pwa-buildpack').transformModules.tap(addTransform => {
  handlers.flush().forEach(request => addTransform(request));
});
```

## FAQ

### How do Targetables work?

They are an abstraction on top of `TransformModuleRequests`. Every call to a Targetable method is turned into a `TransformModuleRequest` object. These objects use builtin Babel plugins and Webpack loaders to make the changes requested.

### Targetables can only make changes to their sources. Why can't a Targetable _get_ some data from its source?

The data isn't there yet! Targetables usually run before their underlying source files are even opened and read. They don't make changes immediately as they're called. Instead, they enqueue changes to run once the file loads. Manually reading the file would access and parse it more than once, which is inefficient and slow.

### Why don't Targetable methods take callbacks that would receive data about the source code, or that return data to configure the TransformRequest?

Callbacks are tricky in Webpack and Babel. Some configuration is serialized before it's passed around. The most efficient way to pass instructions to the Babel plugins is to represent them all as simple TransformRequest objects.


### How many kinds of Targetable are there?

The base Targetable represents a plain module, and can only work with source code. Subclasses include the `TargetableESModule`, which can work with JavaScript, and some other subclasses for common module types.

But the system can work with any filetype, as long as the file is text. In the future, a `TargetableCSSModule` should allow for easy CSS transformation.

### Why more concepts?

These concepts are optional. The initial PWA Studio extension framework was very low-level, on purpose. Our vision is to add convenient concepts to make the public interface more high-level over time, to enable common patterns.

## Demo

Copy and paste this code into `venia-concept/local-intercept.js`, replacing any existing exported function.

```jsx
function localIntercept(targets) {
    const { Targetables } = require('@magento/pwa-buildpack');

    const targetables = Targetables.using(targets);

    const MainComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/Main/main.js'
    );

    const Button = MainComponent.addImport(
        "Button from '@magento/venia-ui/lib/components/Button'"
    );
    MainComponent.appendJSX(
        'div className={pageClass}',
        '<span>appendJSX succeeded!</span>'
    )
        .addJSXClassName('div className={pageClass}', 'pageClass')
        .addJSXClassName('Header', '"another"')
        .insertAfterJSX(
            '<Footer/>',
            `<${Button} type="button" priority="high">insertAfterJSX succeeded!</${Button}>`
        )
        .insertBeforeJSX(
            '<Header />',
            '<span>insertBeforeJSX succeeded!</span>'
        )
        .insertAfterJSX(
            'Header',
            '<span id={`${dot.path}`}>replaceJSX did NOT work, it did NAAAAHT!!</span>'
        )
        .replaceJSX('span id={`${dot.path}`}', '<span>replaceJSX worked</span>')
        .prependJSX('div', '<>prependJSX succeeded!</>')
        .removeJSX('span className="busted"')
        .setJSXProps('Footer', {
            'aria-role': '"footer"',
            'data-set-jsx-props-succeeded': true
        })
        .surroundJSX(
            'Header',
            `div style={{ filter: "blur(1px)", outline: "2px dashed red" }}`
        )
        .insertBeforeJSX(
            'Footer aria-role="footer"',
            '<span>Cumulative select worrrrrked</span>'
        );
}

module.exports = localIntercept;
```

This should mess up the Venia homepage real bad, demonstrating some of the power of Targetables.
