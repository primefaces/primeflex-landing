var PrimeFlex = {

    init: function() {
        this.menu = document.getElementsByClassName('menu')[0];
        this.menulinks = this.menu.querySelectorAll('a');
        this.documentation = document.getElementById('doc');

        this.bindEvents();
        this.initMenuState();
    },

    bindEvents: function() {
        var $this = this;

        this.linkClickListeners = {};
        for (var i = 0; i < this.menulinks.length; i++) {
            var link = this.menulinks[i];
            var namespace = 'primeflex_' + i;
            
            if (!this.linkClickListeners[namespace]) {
                this.linkClickListeners[namespace] = function(e) {
                    var link = e.currentTarget;
                    $this.changePageWithLink(link.getAttribute('href'));
                };
                link.addEventListener('click', this.linkClickListeners[namespace]);
            }
        }

        window.addEventListener("hashchange", function (e) {
            if (!$this.hashChangeByLink) {
                var hash = window.location.hash;
                if (hash) {
                    $this.openPageWithHash(hash);
                }
            }
            else {
                $this.hashChangeByLink = false;
            }
        }, false);
    },

    initMenuState: function() {
        var hash = window.location.hash || '#setup';
        if (hash) {
            this.openPageWithHash(hash);
        }
    },

    changePageWithLink: function(page) {
        if (page !== this.currentPage) {
            this.currentPage = page;
            
            if (page.indexOf('http') === 0) {
                window.location.href = page;
            }
            else {
                this.hashChangeByLink = true;
                this.openPage(page);
                window.location.hash = page;
            }
        }
    },

    openPageWithHash: function(hash) {
        if (hash && hash.length > 1) {
            var plainHash = hash.substring(1);
            this.openPage(plainHash);
        }
    },

    openPage: function(route) {
        var $this = this;
        var pageName = route.replaceAll('#', '');

        this.addClass(this.documentation.childElement, 'hidden');
        this.httpGet(window.location.origin + '/pages/' + pageName + '.html', function(content) {
            $this.documentation.innerHTML = content;
            $this.refreshCodeHighlight();

            $this.removeActiveClass();
            $this.addClass($this.menu.querySelectorAll('a[href*=' + pageName + ']')[0].parentElement, 'active');
        });
    },

    httpGet: function(url, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    },

    onToggleSource: function(el) {
        var sourceEl = el.nextElementSibling;
        var icon = el.querySelector("i");
        if (this.hasClass(icon, 'pi-eye')) {
            this.removeClass(icon, 'pi-eye');
            this.addClass(icon, 'pi-eye-slash');
            sourceEl.style.display = 'block';
            this.refreshCodeHighlight();
        }
        else {
            this.removeClass(icon, 'pi-eye-slash');
            this.addClass(icon, 'pi-eye');
            sourceEl.style.display = 'none';
        }
    },

    copyText: function(e) {
        var copyText = e.currentTarget.previousElementSibling;
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand('copy');

        copyText.style.visibility = 'hidden';
        copyText.previousElementSibling.style.display = 'block';
    },

    refreshCodeHighlight: function() {
        var codes = this.documentation.querySelectorAll('code');
        for (var i = 0; i < codes.length; i++) {
            Prism.highlightElement(codes[i]);
        }  
    },

    removeActiveClass: function() {
        this.removeClass(this.menu.querySelector('.active'), 'active');
    },

    hasClass: function(element, className) {
        if (element) {
            if (element.classList)
                return element.classList.contains(className);
            else
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
    },

    addClass: function(element, className) {
        if (element) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        }
    },

    removeClass: function(element, className) {
        if (element) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
}

PrimeFlex.init();

/* Hero Text Animation */
var Animation = {

    init: function() {
        this.words = document.getElementsByClassName('word');
		this.wordArray = [];
		this.currentWord = 0;

		this.words[this.currentWord].style.opacity = 1;
		for (var i = 0; i < this.words.length; i++) {
		    this.splitLetters(this.words[i]);
        }
        
        this.run();
    },

    changeWord: function () {
		var cw = this.wordArray[this.currentWord];
		var nw = this.currentWord == this.words.length-1 ? this.wordArray[0] : this.wordArray[this.currentWord+1];
		for (var i = 0; i < cw.length; i++) {
			this.animateLetterOut(cw, i);
		}
		
		for (var i = 0; i < nw.length; i++) {
			nw[i].className = 'letter behind';
			nw[0].parentElement.style.opacity = 1;
			this.animateLetterIn(nw, i);
		}
		
		this.currentWord = (this.currentWord == this.wordArray.length-1) ? 0 : this.currentWord+1;
	},

	animateLetterOut: function(cw, i) {
		setTimeout(function() {
			cw[i].className = 'letter out';
		}, i*80);
	},

	animateLetterIn: function(nw, i) {
		setTimeout(function() {
			nw[i].className = 'letter in';
		}, 340+(i*80));
	},

	splitLetters: function(word) {
		var content = word.innerHTML;
		word.innerHTML = '';
		var letters = [];
		for (var i = 0; i < content.length; i++) {
			var letter = document.createElement('span');
			letter.className = 'letter';
			letter.innerHTML = content.charAt(i);
			word.appendChild(letter);
			letters.push(letter);
		}
		
		this.wordArray.push(letters);
    },
    
    run: function() {
        var $this = this;
        this.changeWord();
		setInterval(function() {
            $this.changeWord();
        }, 4000);
    }
}

Animation.init();