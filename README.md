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
    commandsFolder: "commands"
});

bot.go(() => console.log('Logged In'));
```
It is as easy as its looks.<br>
`commandsFolder` folder is where all your commands will be stored.<br>
Everything else looks quite easy to follow up.<br>
Fill up some details and you're ready to *go()* !<br>

**`commands/ping.js` :**
```js
import { Command } from 'breezer.js/dist'

export default class extends Command {
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
Every command is a class, child of the `Command` class.<br>
`structure` - defines a structure for your command.
Helpful when extracting the fields of you commands.<br>
This property will be better understood in the next command. Here there are no fields for this cmd => no structure.<br>
`strict` - set it to true if you want to recieve errors/warnings when:
 - user does not follow the defined structure of the cmd
 - a deleted msg listens for certain state(s)
 - an expired msg listens for state(s).
  
This feature should only be turned on during development.

`name` - optional: will help in debugging in strict mode<br>
`execute` - logics for your command will be defined here.

**`commands/calc.js`:**
```js
import { Command } from 'breezer.js'

export default class extends Command {
    constructor() {
        super({
            structure: ['string'],
            name: 'calc'
        });
    }

    async execute() {
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
Here structure has `string` as its first and only option. Now the user can easily extract the first option using `this.extract`.<br>

*Context:* This string will be an expression `1*3`<br>
*Warning:* Never use `eval` like this, who knows what the operation is.

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
export default class extends Command {
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
        const [by] = this.extract();

        await this.send({
            embeds: [
                new MessageEmbed({
                    title: `${by} x $count$ = {{ ${by} * $count$ }}`
                })
            ]
        });
        
        setInterval(() => {
            this.states.set('count', p => p + 1);
        }, 1000);
    }
}
```
States are special values that when referred in message payload in a special way as string, update their reference in the original message as their value change.

We mention them inside strings using the `$` reference, like this:<br>
`$statename$`.

We can also do operations on states, only when they lie inside `{{ ... }}`
```js
// js methods
{
  content: "Answer is: {{ ['first', 'third'].includes('$answer$') }}"
}
// ternary operations
{
  content: "Count is: {{ $count$ > 5 : 'Big' :'Small' }}"
}
// arithmetic operations
{
  content: "Answer = {{ $num1$ + (($num2$ - 3) * 5)/10 }}"
  // yes, you can have 2 state in an operation!
}
```
Inside the constructor:<br>
`states`: this will be the instance of class `StateManager`. You can clone it to it independent or you can just refer the original object.<br>
`till`: msg listen to its state(s) for a certain time, define that time in minutes in this property. (default: 15min).<br>
Or set it to `forever`, it will always listen for the state(s).

This is what that example cmd (mul) looks in action:
 
![state](https://user-images.githubusercontent.com/70335252/227464358-9358f0a9-8f57-4bec-b7a4-89a2337c1052.gif)


## HANDLERS
These are some extra functions available in the library to make stuff easier.

### buttonSignal()
This handler is a syntactic-sugar for `createMessageComponentCollector`.<br>
This can be used in situations when one wants to collect button interactions when some specific users click the button.

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
So buttonSignal accepts 3 arguments
 - **users**: array containing the user id who can click the button
 - **msg**: the message that contains the buttons
 - **props**: an optional parameter specifying these 3 properties-
    - **customId**: the only button from the row that you'll listen to (its id)
    - **max**: maximum valid clicks
    - **time**: the time interval (in ms) for which the button will be valid and clicks will matter

This function returns the normal discord's interaction listener listening for `collect` and `end`. 