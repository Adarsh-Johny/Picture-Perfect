angular.module('customValidation', [])
    .directive('customValidation', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attrs, ctrl) {
                if(!ctrl)return;
                var expression = attrs.customValidation;
                ctrl.$validators.customValidation = function (modelValue, viewValue) {
                    if (evalExpr(scope,expression, viewValue)) {
                        console.log("here in true");
                        ctrl.$setViewValue(viewValue);
                        return true;
                    }
                    else {
                        console.log("here in false");
                        ctrl.$setViewValue(viewValue);
                        return false;
                    }
                };
            }
        };
        function evalExpr(scope, expr, vVal){
            if(expr.indexOf('(')){
                var fnName = expr.split('(')[0];
                var args = expr.split('(')[1].split(')')[0].split(',');
                args = args.map(function(it, i){
                    if(i==0){
                        return vVal;
                    }
                    if(it.indexOf('.')){
                        var tree = it.split('.');
                        var root = scope[tree[0]];
                        for(var i = 1; i<tree.length; i++){
                            root = root[tree[i]];
                        }
                        return root;
                    }else{
                        return scope[it];
                    }
                });
                var fn = scope[fnName];
                return fn.apply(null, args);
            }else{
                var fn = scope[expr];
                return fn();
            }
        }

    });
