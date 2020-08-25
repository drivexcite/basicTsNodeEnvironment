# A basic node.js and typescript environment

## Requirements
- Docker Desktop
- Visual Studio Code with Remote Containers Extension.

## Development container
To facilitate the development, we can use the Remote Containers extension in VS Code to create a virtual environment with all the right versions of Node.js and TypeScript. To try it out:
- Open VS Code on an empty folder.
- Press Ctl + Shift + P and select `Remote-Containers : Add Development Container Configuration Files`
- Expand the List to Show all Options and select `Node.js 14 & TypeScript`
- Verify that in your folder there is a `.devcontainer` folder with two files: `Dockerfile` and `devcontainer.json`
- Open the `devcontainer.json`, uncomment the forwardPorts node, and add ports `8080` and `9090`.
- Press Ctl + Shift + P and select `Remote-Containers :Remote-Containers: Reopen Folder in Container`
- To see the details, expand the terminal.

```javascript
"forwardPorts": [
		8080,
		9090,
		5000,
		3000
	],
```

## Initializing the development folder
To create a package.json:
```bash
npm init -y
```

To create folders and initial files:
```bash
mkdir src
mkdir dist
touch src/index.ts
```

## Installing dev dependencies
Once the development container has started, the environment needs some development dependencies to get going:
- The TypeScript compiler.
- The Node.js type definitions.
- And a couple of tools to make the developer experience more streamlined: `ts-node`, to be able to compile ts files and run them in node with a single command; and `nodemon` a development tool to automatically reload the environment when source files change.

```bash
npm i -D typescript @types/node ts-node nodemon
```

## Creating a tsconfig.json file.
```bash
tsc --init
```

At the very least, it is necessary to set the `src` and `dist` directories in the configuration file.
```javascript
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "allowJs": true, 
    "checkJs": true, 
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true, 
    "moduleResolution": "node",
    "esModuleInterop": true, 
    "skipLibCheck": true, 
    "forceConsistentCasingInFileNames": true
  }
```

## Adding scripts to package.json
```javascript
"scripts": {
    "build": "tsc",
    "start": "ts-node src/index.ts",
    "start-dev": "nodemon --exec ts-node src/index.ts"
  },
```
## Adding typescript to an existing CRA app.
- Run ```yarn add typescript```
- Take the ```src/server/httpUtils.js``` and rename it with a ```ts``` extension
- Annotate the parameters of the ```getTopics``` function and add type annotations; they should look like ```getTopics(skip: number, top: number)```
- Run  ```yarn start```; the runner will automatically create a ```ts.config``` file with good defaults.

And that's it. The application has been migrated to TS!

For a slightly more elaborated example, change the signature of the function as follows:
```typescript
export async function getTopics(skip: number, top: number): Promise<TopicCollection> {
    var result = await axios.get(`http://localhost:9090/topics?skip=${skip}&top=${top}`);

    if (result.status === 200)
        return result.data;

    return { topics: [], pagination: { count: 0, skip: 0, top: 0 } };
}
```

Go to the ```App.js``` file and notice how without changing module imports, or anything, the type information from this method is available in the VS Code autocomplete, with the type information of each property of every object returned by ```getTopics```.
