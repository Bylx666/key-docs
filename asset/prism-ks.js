(function () {
	var multilineComment = /\/'(?:[^'/])'\//.source;

	Prism.languages.ks = {
		'comment': [
			{
				pattern: RegExp(/(^|[^\\])/.source + multilineComment),
				lookbehind: true,
				greedy: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true,
				greedy: true
			}
		],
		'string': {
			pattern: /["'`](?:\\[\s\S]|[^\\`])*["'`]/,
			greedy: true
		},

		'closure-params': {
			pattern: /(?=([=(,:]\s*))\|[^|]*\||\|[^|]*\|/,
			lookbehind: true,
			greedy: true,
			inside: {
				'closure-punctuation': {
					pattern: /^\||\|$/,
					alias: 'punctuation'
				},
				rest: null // see below
			}
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
		'keyword': [
			/\b(is|for|key|async|await|let|const|extern|return|class|mod|for|if|else|break|continue|self|match)\b/,
			/\b\:?=(\b|\s|\!|\-|[a-z])/
		],

		'function': /\b[a-z_@~]\w*(?=\s*\()/,
		'constant': /\b[A-Z_@~][A-Z_@~\d]+\b/,
		'class-name': /\b[A-Z_@~]\w*\b/,

		'namespace': {
			pattern: /(?:\b[a-z_@~][a-z_@~\d]*\s*[::|\-:|\-.]\s*)*\b/,
			inside: {
				'punctuation': /[::|\-:|\-.]/
			}
		},

		'boolean': /\b(?:false|true)\b/,
		'punctuation': /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
		'operator': /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
	};

}());
