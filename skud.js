function scud(params){
    "use strict";
    var obj = this;

    obj.patterns = {};
    obj.params = {
        load_path : params ? (params['load_path'] ? params['load_path'] : '/tpls/') : '/tpls/'
    };
    obj.process_patern = function(oReplaces, pattern_name, ready_func){
        if(typeof oReplaces == 'object' && typeof pattern_name == 'string'){
            load_pattern(pattern_name, function(pattern_str){
                obj.process_str(oReplaces, pattern_str, ready_func);
            });
        }else if(ready_func)
            ready_func('');
    };
    obj.process_str = function(oReplaces, pattern, ready_func){
        process_inc(pattern, function(pattern_str){
            for(var needle in oReplaces){
                if(oReplaces.hasOwnProperty(needle)){
                    var needle_rx = new RegExp('{' + needle + '}','g');
                    pattern_str = pattern_str.replace(needle_rx, oReplaces[needle]);
                }
            }
            var each_rx = /\{EACH:([a-z0-9_]+:[a-z0-9_]+)}/ig,
                each = [],
                ea;

            while(ea = each_rx.exec(pattern_str))
                each.push(ea);

            if(each.length){
                var ready = [];
                for(var i = 0; i < each.length; i++){
                    var params = each[i][1].split(':');
                    process_each(oReplaces[params[0]], params[1], each[i][0], i, function(eaches_str, repl, c){
                        pattern_str = pattern_str.replace(repl, eaches_str);
                        ready.push(c);
                        if(ready.length == each.length){
                            pattern_str = pattern_str.replace(/\{[a-z0-9_-]+}/ig, '');
                            ready_func(pattern_str);
                        }
                    });
                }
            }else{
                if(ready_func){
                    pattern_str = pattern_str.replace(/\{[a-z0-9_-]+}/ig, '');
                    ready_func(pattern_str);
                }
            }
        });
    };
    var process_inc = function(str, callback){
        var _inc = /\{INC:([a-z0-9_-]+)}/ig,
            t = [],
            r = [],
            _tmp = null;
        if(t = str.match(_inc)){
            while(_tmp = _inc.exec(str)){
                load_pattern(_tmp[1], function(res, repl){
                    str = str.replace(repl[0], res);
                    r.push(repl[1]);
                    if(r.length == t.length && typeof callback == 'function')
                        callback(str);
                }, _tmp);
            }
        }else if(typeof callback == 'function')
            callback(str);
    };
    var process_each = function(replacesArr, pattern_name, repl, each_num, ready_func){
        if(replacesArr && replacesArr.length){
            load_pattern(pattern_name, function(pattern_str){
                var result_str = '';
                for(var i = 0; i <= replacesArr.length; i++){
                    var tmp_str = pattern_str;
                    if(i == replacesArr.length){
                        ready_func(result_str, repl, each_num);
                        break;
                    }
                    for(var needle in replacesArr[i]){
                        if(replacesArr[i].hasOwnProperty(needle)){
                            if(replacesArr[i][needle] == null)
                                replacesArr[i][needle] = '';

                            var needle_rx = new RegExp('{' + needle + '}','g');
                            tmp_str = tmp_str.replace(needle_rx, replacesArr[i][needle]);
                        }
                    }
                    result_str += tmp_str;
                }
            });
        }else if(ready_func)
            ready_func('',repl,0);
    };
    var load_pattern = function(name, callback, pattern_num){
        if(obj.patterns[name] && obj.patterns[name].length > 0){
            if(typeof callback == 'function')
                callback(obj.patterns[name], pattern_num);
        }else{
            $.ajax({
                type: "GET",
                url: obj.params.load_path + name + '.tpl?' + Math.random(),
                success: function(resp){
                    obj.patterns[name] = resp;
                    if(callback)
                        callback(obj.patterns[name], pattern_num);
                },
                async: false
            });
        }
    };
    var Sm = function(){
        if(params && params.hasOwnProperty('patterns') && params['patterns'] instanceof Array && params['patterns'].length){
            var r = [];
            for(var i = 0; i <= params['patterns'].length; i++)
                if(typeof params['patterns'][i] == 'string')
                    load_pattern(params['patterns'][i], function(pat, inner){
                        r.push(inner);
                        if(r.length == params['patterns'].length)
                            return obj;
                    }, i);
        }else
            return obj;
    };
    return Sm();
}
