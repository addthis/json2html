var expect = chai.expect;
mocha.setup('bdd');



describe('json2html', function() {
	
	describe('tag', function() {
		
		it('accepts raw tag', function() {
			var hello = {
				'h1':'test1'
			};
			var h1 = json2html(hello);
			expect(h1 instanceof HTMLHeadingElement).to.equal(true);
			expect(h1.innerHTML).to.equal('test1');
		});
		
		it('assumes empty tag to be div', function() {
			var div = {
				'.asdf':'test2'
			};
			div = json2html(div);
			expect(div instanceof HTMLDivElement).to.equal(true);
			expect(div.innerHTML).to.equal('test2');
		});
		
		it('accepts tag w id', function() {
			var hello = {
				'h1#asdf':'test1'
			};
			var h1 = json2html(hello);
			expect(h1 instanceof HTMLHeadingElement).to.equal(true);
			expect(h1.innerHTML).to.equal('test1');
		});
		
		it('accepts tag w classname', function() {
			var hello = {
				'h1.test1':'test1'
			};
			var h1 = json2html(hello);
			expect(h1 instanceof HTMLHeadingElement).to.equal(true);
			expect(h1.innerHTML).to.equal('test1');
		});
		
		it('accepts dashes in classnames + ids', function() {
			var hello = {
				'h1.test-1#id-1':'test1'
			};
			var h1 = json2html(hello);
			expect(h1 instanceof HTMLHeadingElement).to.equal(true);
			expect(h1.className).to.equal('test-1');
			expect(h1.getAttribute('id')).to.equal('id-1');
		});
		
		it('accepts underscores in classnames + ids', function() {
			var hello = {
				'h1.test_1#id_1':'test1'
			};
			var h1 = json2html(hello);
			expect(h1 instanceof HTMLHeadingElement).to.equal(true);
			expect(h1.className).to.equal('test_1');
			expect(h1.getAttribute('id')).to.equal('id_1');
		});
		
		it('classnames + ids cant start with dash. simply ignores that name', function() {
			var hello = {
				'h1.-test_1.hey#-	id_1':'test1'
			};
			var h1 = json2html(hello);
			expect(h1 instanceof HTMLHeadingElement).to.equal(true);
			expect(h1.className).to.equal('hey');
			expect(h1.getAttribute('id')).to.equal(null);
		});
		
		
		
		
	});
	
	describe('classes', function() {
		
		it('sets className', function() {
			var hello = {
				'h1.name':'test1'
			};
			var classTest = json2html(hello);
			expect(classTest.className).to.equal('name');
		});

		it('sets multiple classNames', function() {
			var hello = {
				'h1.name.two':'test1'
			};
			var classTest = json2html(hello);
			expect(classTest.className).to.contain('name');
			expect(classTest.className).to.contain('two');
			expect(classTest.className).to.not.contain('.');
		});
		
		it('sets classnames when split with an id', function() {
			var hello = {
				'h1.asdf.ahoy#name.qwer':'test1'
			};
			var idTest = json2html(hello);
			expect(idTest.className).to.include('asdf');
			expect(idTest.className).to.include('ahoy');
			expect(idTest.className).to.include('qwer');
			expect(idTest.className).to.not.include('name');
			expect(idTest.className).to.not.include('.');
			expect(idTest.className).to.not.include('#');
		});
		
	});
	
	describe('id', function() {
		
		it('sets id when present as last element', function() {
			var hello = {
				'h1.asdf#name':'test1'
			};
			var idTest = json2html(hello);
			expect(idTest.getAttribute('id')).to.equal('name');
		});

		it('sets id when followed by a classname', function() {
			var hello = {
				'h1.asdf#name.qwer':'test1'
			};
			var idTest = json2html(hello);
			expect(idTest.getAttribute('id')).to.equal('name');
		});

		it('sets id when preceding a classname', function() {
			var hello = {
				'h1#name.qwer':'test1'
			};
			var idTest = json2html(hello);
			expect(idTest.getAttribute('id')).to.equal('name');
		});
		
	});
	
	
	
	describe('attribute', function() {
		
		it('accepts image with src attribute', function() {
			var imgTemplate = {
				'img.fdsa': {
					'src':'http://www.addthis.com/favicon.ico'
				}
			};

			var image = json2html(imgTemplate);
			expect(image instanceof HTMLImageElement).to.equal(true);
			expect(image.getAttribute('src')).to.equal('http://www.addthis.com/favicon.ico');
		});
		
	});
	
	describe('children', function() {
		
		it('orders children elements correctly', function() {
			var hello = {
				'div.classq': [
					{'div.last': {
						'src':'aloha',
						'html':'there'
					}}, {
						'button.sup':'hey'
					}
				]
			};
			var arrayTest = json2html(hello);
			expect(arrayTest.childNodes[0] instanceof HTMLDivElement).to.equal(true);
			//expect(arrayTest.childNodes[0] instanceof HTMLButtonElement).to.equal(false);
		});
		
				
	});

	describe('nesting', function() {
		
		it('accepts nested objects', function() {
			var divTemplate = {
				'div.qwerty': {
					'img.fdsa': {
						'src':'http://www.addthis.com/favicon.ico'
					}
				}
			};

			var nestedDiv = json2html(divTemplate);
			expect(nestedDiv instanceof HTMLDivElement).to.equal(true);
			var image = nestedDiv.childNodes[0];
			expect(image instanceof HTMLImageElement).to.equal(true);
			expect(image.getAttribute('src')).to.equal('http://www.addthis.com/favicon.ico');
		});
		
		it('accepts nests without classnames', function() {
			var divTemplate = {
				'div': {
					'img': {
						'src':'http://www.addthis.com/favicon.ico'
					}
				}
			};

			var nestedDiv = json2html(divTemplate);
			expect(nestedDiv instanceof HTMLDivElement).to.equal(true);
			var image = nestedDiv.childNodes[0];
			expect(image instanceof HTMLImageElement).to.equal(true);
			expect(image.getAttribute('src')).to.equal('http://www.addthis.com/favicon.ico');
		});

		it('accepts deeply nested objects', function() {
			var nestTemplate = {
				'div.qwer':{
					'div.rewq': {
						'div.asdf':{
							'div.ytre':'hello'
						}
					}
				}
			}
			var nest = json2html(nestTemplate);
			var text = nest.childNodes[0].childNodes[0].childNodes[0].innerHTML;
			expect(text).to.equal('hello');
		});
		
	});
	

	
	describe('lists', function() {
		
		it('accepts basic array of elements', function() {
			var hello = {
				'ul.classq': [
					{'li.qwer':'hey'},
					{'li.qwer':'yo'},
				]
			};
			var arrayTest = json2html(hello);
			expect(arrayTest instanceof HTMLUListElement).to.equal(true);
			expect(arrayTest.childNodes.length).to.equal(2);
			expect(arrayTest.childNodes[0].innerHTML).to.equal('hey');
			expect(arrayTest.childNodes[1].innerHTML).to.equal('yo');
		});
		
		it('accepts more complex array of elements', function() {
			var hello = {
				'ul.classq': [
					{'li.qwer': {'div.q':'sup'}},
					{'li.qwer':'yo'}
				]
			};
			var arrayTest = json2html(hello);
			expect(arrayTest instanceof HTMLUListElement).to.equal(true);
			expect(arrayTest.childNodes.length).to.equal(2);
			expect(arrayTest.childNodes[0].childNodes[0] instanceof HTMLDivElement).to.equal(true);
			expect(arrayTest.childNodes[1].innerHTML).to.equal('yo');
		});
	});
	
	describe("elements", function() {
		
		it("allows elements to be passed", function() {
			var a = {
				"a": {
					href: "http://www.github.com",
					html: "gotothere"
				}
			};
			var child = json2html(a);
			var parentObj = {
				"div.holder": child
			};
			var el = json2html(parentObj);
			expect(el instanceof HTMLDivElement).to.equal(true);
			expect(el.childNodes[0].getAttribute('href')).to.equal('http://www.github.com');
			
		});
		
		it("allow it to swallow its own tail", function() {
			var a = {
				"a": {
					href: "http://www.github.com",
					html: "gotothere"
				}
			};
			var child = json2html(a);
			var parentObj = {
				"div.holder": child
			};
			var el = json2html(parentObj);
			el = json2html(el);			
		});
		
	});
	
	describe("children redux", function() {
		
		it("allows elements to be passed", function() {
			var div = {
				"div": {
					"style": "position:relative",
					"children": [
						{
							"img": {
								"src":'http://www.addthis.com/favicon.ico'
							}
						}
					]
				}
			};
			var child = json2html(div);
			expect(child.getAttribute('style')).equals('position:relative')
			expect(child.childNodes.length).equals(1);
			expect(child.childNodes[0].src).equals('http://www.addthis.com/favicon.ico');			
		});
	});
});


mocha
	.run()
	.globals(['*'])

