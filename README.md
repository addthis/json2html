#json2html

__json2html__ is a straightforward way to store HTML in JavaScript. It's not a template solution _per se_, but it lends itself to the application.


- Native HTML:

```html
			<div class="name-tag">Hello, World</div>
```

- json2html

```javascript
			{ "div.name-tag": "Hello, World" }
```

##Usage

	var elObj = { "span" : "Testing" };

	var el = json2html(elObj);
	
	$(el)  //the element already exists
		--> [<span>​testing​</span>]

##Syntax

###Basic

Object keys communicate element __tag__, __classes__, and __id__ à la [Jade](http://jade-lang.com/).

```javascript
	{ "h1": "Hello, World" }
```

&nbsp;&nbsp;&nbsp;&nbsp;&rarr;

```html
	<h1>Hello, World</h1>
```

####Classes/Id

__Classes__

```javascript
	{ "h1.header.example": "Hello, World" }
```

&nbsp;&nbsp;&nbsp;&nbsp;&rarr;

```html
	<h1 class="header example">Hello, World</h1>
```

__Add an Id__

```javascript
	{ "h1#header.header.example": "Hello, World" }
```

&nbsp;&nbsp;&nbsp;&nbsp;&rarr;

```html
	<h1 id="header" class="header example">Hello, World</h1>
```

####Attributes

json2html takes a guess here, hoping you haven't got any "span" attributes. Note that "html" ~ innerHTML, although internally it creates a textNode.

```javascript
	{ 
		"a": {
			href: "http://www.github.com",
			html: "Github"
		} 
	}
```

&nbsp;&nbsp;&nbsp;&nbsp;&rarr;

```html
	<a href="http://www.github.com">Github</a>
```

####Nested elements

Nested elements are treated recursively, which has performance implications

```javascript
{
	"div": {
		"p": "This is a paragraph"
	}
}
```

&nbsp;&nbsp;&nbsp;&nbsp;&rarr;

```html
	<div>
	     <p>
	          This is a paragraph
	     </p>
	</div>
```

####Children

Use arrays to keep order:




```javascript
	{
		"div": [
				{"p": "This is paragraph one"},
				{"p": "This is paragraph two"}
			]
		}
	}
```

&nbsp;&nbsp;&nbsp;&nbsp;&rarr;

```html
	<div>
	     <p>
	          This is paragraph one
	     </p>
	     <p>
	          This is paragraph two
	     </p>
	</div>
```


##Templating

Templating in json2html is a little more hands-on than traditional microtemplating. However, it is straightforward and typically yields performance gains.

We're totally still exploring the templating pattern.

```javascript
	var nameTag = _.template('<div class="name-tag">Hello, <%= name %></div>');
	nameTag({name: "World"});
```

```javascript
	var nameTag = function(name) {
		return json2html({
			"div.name-tag": "Hello, " + name
		});
	}
	nameTag("World");
```

```html
	<div class="name-tag">Hello, World</div>
```

##Performance

json2html operates using native javascript syntax, e.g. a lot of:

```javascript
	var div = document.createElement("div");
	var text = document.createTextNode("Hello, World");
	div.appendChild(text);
```

Which is typically faster than:

```javascript
	$(el).append("<div>Hello, World</div>");
```

However, really robust benchmarks are still on the todo.


##TODO

- Remove deprecated "callee" use
- Robust benchmarks
- Plugin system. For instance, one to pass "click": fn and have an onclick listener.
- Templating patterns. What's the friendliest way to write a template as JSON? 

##License

json2html is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)