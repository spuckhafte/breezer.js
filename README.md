# BREEZER JS
An elegant framework for discord.js :)

***Still under development (v0), only `msgCreate` is supported for now...***

### Features:
 - Typescript support
 - Simple and intuitive
 - State management<br>
    *more coming soon*

## Getting Started

### Installation
```
npm i breezer.js
npm i discord.js@v13
```
### Project setup
```
MyBot:
 --index.js
 --commands:
    --ping.js
    --calc.js
    --mul.js
```
### A Basic Example
**`index.js` :**
```js
import { Bot } from 'breezer.js'

const bot = new Bot({
    token: "<BOT_TOKEN>",
    prefix: "+",
    commandsFolder: "commands",
    // intents: []
});

bot.go(() => console.log('Logged In'));
```
It is as easy as it looks.<br>
The `commandsFolder` is where all your commands will be stored.<br>
Everything else is quite straightforward. Fill in some details and you’re ready to `go()`!

*Note: There is also an [optional] property to have custom intents. Breezer automatically sets the most common ones by default.*

**`commands/ping.js` :**
```js
import { Command } from 'breezer.js'

export default class extends Command<[]> {
    constructor() {
        super({
            structure: [],
            name: 'ping', // same as the file name
            strict: true // optional (def:false)
        });
    }

    async execute() {
        this.msg.reply({
            content: 'Pong!',
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}
```
In this framework, every command is represented as a class that inherits from the `Command` class. Here's a breakdown of the key components:

1. **Command Class Generic Type (`Command<[]>`):**
   - **Purpose:** This generic type defines the structure of your command.
   - **Benefit:** It helps with type inference for different fields returned by the `this.extract()` method (which will be explained later).

2. **`structure` Property:**
   - **Purpose:** This property defines the structure of your command.
   - **Benefit:** It is useful for extracting and validating the fields of your commands.
   - **Note:** If there are no fields for a command, the `structure` property will be empty. Its utility will be clearer in the context of the next command.

3. **`strict` Property:**
   - **Purpose:** When set to `true`, this property enables error and warning reporting for several scenarios:
     - If a user does not follow the defined command structure.
     - If a deleted message still listens for certain states.
     - If an expired message listens for certain states.
   - **Recommendation:** This feature should only be enabled during development to catch and address potential issues early.

4. **`name` Property:**
   - **Purpose:** This optional property helps with debugging, especially when `strict` mode is enabled.

5. **`execute` Method:**
   - **Purpose:** This is where you define the logic for what your command should do.

By structuring your commands with these properties, you ensure that they are well-defined, validated, and easier to debug and maintain.
**`commands/calc.js`:**
```js
import { Command } from 'breezer.js'

export default class extends Command<[string]> {
    constructor() {
        super({
            structure: ['string'],
            name: 'calc'
        });
    }

    async execute() {
        // operation: string
        const [operation] = this.extract();
        let value;
        try {
            value = eval(operation);
        } catch (_) {
            value = 'Invalid Operation'
        }

        this.msg.channel.send(value.toString());
    }
}
```
Here the `structure` has `string` as its first and only option. Now the user can easily extract the fields using `this.extract`.<br>

*Context:* The string that user provides in the field will be an expression: `1*3`<br>
*Warning:* Never use `eval` in this manner, as the operation within the string is unknown and could be potentially dangerous.

`Structure` can have these values:<br>
```js
"string", "string|null", "number", "number|null"
```
The nullable properties keep you safe in strict mode and while extracting.

Example of a structure:
```js
["string", "number", "number", "string|null"]
```
Here a command will accept 4 options.<br>
If a user does not follow this structure in strict mode, it'll raise an error and you bot will stop.<Br>
You can also easily extract these options:
```js
// inside execute()
const [opt1, opt2, opt3, opt4] = this.extract();
```
**NOTE**: There can be only one nullable option, that too at the end.

**`commands/mul.js`:**
```js
import { Command, StateManager } from 'breezer.js';
import { MessageEmbed } from 'discord.js';

const state = new StateManager({
    count: 1
});
export default class extends Command<[number]> {
    constructor() {
        super({
            name: 'mul',
            structure: ["number"],
            states: state.clone(),
            strict: true,
            till: 1
        });
    }
    async execute() {
        // by: number
        const [by] = this.extract();

        await this.send({
            embeds: [
                new MessageEmbed({
                    title: `${by} x $count$ = << ${by} * $count$ >>`
                })
            ]
        });
        
        setInterval(() => {
            this.states.set('count', p => p + 1);
        }, 1000);
    }
}
```
States are special values that, when referenced in the message payload using a specific "stringy" format, update their reference in the original message as their values change.

We mention them inside strings using the `dollar reference`, like this:<br>
`$statename$`.

You can also do operations on states, only when they lie inside `<< ... >>`
```js
// js methods
{
  content: "Answer is: << ['first', 'third'].includes('$answer$') >>"
}
// ternary operations
{
  content: "Count is: << $count$ > 5 : 'Big' :'Small' >>"
}
// arithmetic operations
{
  content: "Answer = << $num1$ + (($num2$ - 3) * 5)/10 >>"
  // yes, you can have 2 state in an operation!
}
```
Inside the constructor:<br>
- `states`: This will be an instance of the `StateManager` class. You can either clone it to create an independent instance or refer to the original object directly.<br>
  - *_Note:_ If you use the original `StateManager` object, the state value will be "cached" for each command a user runs. This means it will pick up the last updated value as the initial value, instead of using the hardcoded one inside the `StateManager` object.*<br>

- `till`: msg listens to its state(s) for a defined duration, specified in minutes, using this property (default: 15 minutes).<br>
Alternatively, set it to `"forever"` if you want the message to always listen for the state(s).

This is what that example cmd (mul) looks in action:
 
![state](https://user-images.githubusercontent.com/70335252/227464358-9358f0a9-8f57-4bec-b7a4-89a2337c1052.gif)


## HANDLERS
These are some extra functions available in the library to make stuff easier.

### buttonSignal()
This handler is a syntactic-sugar for `createMessageComponentCollector`.<br>
This can be used in situations when one wants to collect button interactions if some specific users click the button.

```js
import { buttonSignal } from 'breezer.js'

// inisde execute()
const sentMsg = this.msg.reply({
    components: [row]
});

buttonSignal(
    ['userid1', 'userid2'], // users
    sentMsg, // msg
    { max: 3, time: 2000 } // props (opt)

).on('collect', async btn => {
    await btn.deferUpdate();
    ...
}).on('end', async collection => {
    ...
});

/** 
 This signal will listen for 
    * max 3 clicks, for
    * 2 seconds, from
    * user with id 1 and 2 only, on
    * every button in the "row"
 */
```
The `buttonSignal` function accepts three arguments:
- **`users`:** An array containing the user IDs who are allowed to click the button. If the array is empty, anyone can click the button.
- **`msg`:** The message that contains the buttons.
- **`props`:** An optional parameter specifying the following properties:
  - **`customId`:** The ID of the specific button in the row that you'll listen to.
  - **`max`:** The maximum number of valid clicks.
  - **`time`:** The time interval (in milliseconds) during which the button will be valid and clicks will be considered.

This function returns the normal discord's interaction listener listening for `collect` and `end`. 

### HasPerm Methods
A method and a function to check if the bot or any user has certain perm in the channel linked to a cmd's msg.

#### Inside a Command class (checks only for the bot)
```ts
this.botHasPerm( perm: PermissionResolvable ): boolean
```

#### Anywhere (checks for any user)
```ts
import { userHasPerm } from 'breezer.js';
userHasPerm( perm, userId: string, msg: Message ): Promise<boolean>
```
