# Spruce Markdown App Help Guide

Welcome to the Markdown App! This guide will help you get started and make the most out of the app's features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Features](#basic-features)
   - [Writing and Editing](#writing-and-editing)
3. [Formatting Options](#formatting-options)
   - [Headings](#headings)
   - [Emphasis](#emphasis)
   - [Lists](#lists)
   - [Links](#links)
   - [Images](#images)
   - [Code Blocks](#code-blocks)
   - [Tables](#tables)
   - [Task Lists](#task-lists)
4. [Advanced Functionalities](#advanced-functionalities)
5. [Troubleshooting](#troubleshooting)
   - [Common Issues](#common-issues)
   - [Support](#support)
6. [Feedback and Support](#feedback-and-support)

## Getting Started

To use the Markdown App, follow these simple steps:

1. **Installation:** Download and install the app on your device from [our website](https://example.com/markdown-app).

2. **Launch the App:** Open the app on your device.

3. **Create a New Document:** Click on the "New Document" button to start a new Markdown document.

## Basic Features

### Writing and Editing

- Use the standard text editor to write and edit your Markdown content.
- Save your document using the "Save" button.

## Formatting Options

Learn how to format your text using Markdown syntax:

### Line Breaks
To force a line break, put two spaces and a newline (return) at the end of the line.

* This two-line bullet 
won't break

* This two-line bullet  
will break

Here is the code:

```
* This two-line bullet 
won't break

* This two-line bullet  
will break
```

### Headings

# Heading 1
## Heading 2
### Heading 3
#### heading 4
##### heading 5
###### heading 6

### Emphasis

- *Italic*
- **Bold**

### Lists

* Lists must be preceded by a blank line (or block element)
* Unordered lists start each item with a `*`
- `-` works too
	* Indent a level to make a nested list
		1. Ordered lists are supported.
		2. Start each item (number-period-space) like `1. `
		42. It doesn't matter what number you use, I will render them sequentially
		1. So you might want to start each line with `1.` and let me sort it out

Here is the code:

```
* Lists must be preceded by a blank line (or block element)
* Unordered lists start each item with a `*`
- `-` works too
	* Indent a level to make a nested list
		1. Ordered lists are supported.
		2. Start each item (number-period-space) like `1. `
		42. It doesn't matter what number you use, I will render them sequentially
		1. So you might want to start each line with `1.` and let me sort it out
```

### Block Quote

> Angle brackets `>` are used for block quotes.  
Technically not every line needs to start with a `>` as long as
there are no empty lines between paragraphs.  
> Looks kinda ugly though.
> > Block quotes can be nested.  
> > > Multiple Levels
>
> Most markdown syntaxes work inside block quotes.
>
> * Lists
> * [Links][arbitrary_id]
> * Etc.

Here is the code:

```
> Angle brackets `>` are used for block quotes.  
Technically not every line needs to start with a `>` as long as
there are no empty lines between paragraphs.  
> Looks kinda ugly though.
> > Block quotes can be nested.  
> > > Multiple Levels
>
> Most markdown syntaxes work inside block quotes.
>
> * Lists
> * [Links][arbitrary_id]
> * Etc.
```
  
  
### Inline Code
`Inline code` is indicated by surrounding it with backticks:  
`` `Inline code` ``

If your ``code has `backticks` `` that need to be displayed, you can use double backticks:  
```` ``Code with `backticks` `` ````  (mind the spaces preceding the final set of backticks)


### Block Code
If you indent at least four spaces or one tab, I'll display a code block.

	print('This is a code block')
	print('The block must be preceded by a blank line')
	print('Then indent at least 4 spaces or 1 tab')
		print('Nesting does nothing. Your code is displayed Literally')

I also know how to do something called [Fenced Code Blocks](#fenced-code-block) which I will tell you about later.

### Horizontal Rules
If you type three asterisks `***` or three dashes `---` on a line, I'll display a horizontal rule:

***

### Links and Email
#### Inline
Just put angle brackets around an email and it becomes clickable: <uranusjr@gmail.com>  
`<uranusjr@gmail.com>`  

Same thing with urls: <http://macdown.uranusjr.com>  
` <http://macdown.uranusjr.com>`  

Perhaps you want to some link text like this: [Spruce Markdown APP](https://iamspruce.dev/sprucemarkdownapp "Title")  
`[Macdown Website](https://iamspruce.dev/sprucemarkdownapp "Title")` (The title is optional)  

### Images

- ![Alt Image Text](path/or/url/to.jpg "Optional Title")

### Code Blocks

```python
def hello_world():
    print("Hello, World!")
```


### Tables

| Header 1  | Header 2  |
| --------- | --------- |
| Content 1 | Content 2 |

### Task Lists

- [ ] Task 1
- [ ] Task 2

### TeX-like Math Syntax
I can also render TeX-like math syntaxes, if you allow me to.[^math] I can do inline math like this: $$( 1 + 1 \\)$$ or this (in Latex): 

$$
L = \frac{1}{2} \rho v^2 S C_L
$$

$$
    A^T_S = B
$$

### Jekyll front-matter
If you like, I can display Jekyll front-matter in a nice table. Just make sure you put the front-matter at the very beginning of the file, and fence it with `---`. For example:

```
---
title: "Macdown is my friend"
date: 2014-06-06 20:00:00
---
```

## Advanced Functionalities

Explore advanced features to enrich your Markdown experience.

## Troubleshooting

If you encounter any issues, consider the following:

### Common Issues

- Ensure your app is up to date.
- Check for an active internet connection.

### Support

For further assistance, reach out to our support team at support@example.com.

## Feedback and Support

We appreciate your feedback! If you have suggestions or encounter any issues, please share them with us at feedback@example.com.

Thank you for selecting the Markdown App! Happy writing!