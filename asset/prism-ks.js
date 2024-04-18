(function () {

	Prism.languages.ks = {
		'comment': [
			{
				pattern: /\/'[^\/]*'\//,
				lookbehind: true,
				greedy: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true,
				greedy: true
			}
		],
		'string': [
			{
				pattern: /"([\s\S])*?"/
			},
			{
				pattern: /`(?:\\[\s\S]|[^\\`])*?`/
			},
			{
				pattern: /'([\s\S])*?'/
			}
		],

		'closure-params': {
			pattern: /(?=([=(,:]\s*))\|[^|]*\||\|[^|]*\|/
		},

		'function-definition': {
			pattern: /(\blet\s+)\w+\(/,
			lookbehind: true,
			alias: 'function'
		},
		'type-definition': {
			pattern: /(class\s+)\w+/,
			lookbehind: true,
			alias: 'class-name'
		},
		'module-declaration': [
			{
				pattern: /(\bmod\s+)[\s\S^\>]*\>/,
				lookbehind: true,
				alias: 'namespace'
			}
		],
		'keyword': /\b(is|for|key|async|await|let|const|extern|return|class|mod|for|if|else|break|continue|self|match|fall|take|swap|throw|try|catch)\b/,

		'function': /\b[a-z_@~]\w*(?=\s*\()/,
		'constant': /\b[A-Z_@~][A-Z_@~\d]+\b/,
		'class-name': /\b[A-Z_@~]\w*\b/,

		'number': /0u/,
		'boolean': /\b(?:false|true)\b/,
		'punctuation': /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
		'operator': /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
	};

}());
