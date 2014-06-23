/**
 * Created by a2014 on 14-6-23.
 */
function inherit(subclass, superclass) {
    var F = function () {
        },
        subclassProto = subclass.prototype,
        superclassProto = superclass.prototype;

    F.prototype = superclassProto;
    subclass.prototype = new F();
    subclass.prototype.constructor = subclass;
    subclass.superclass = superclassProto;

    if (superclassProto.constructor === Object.constructor) {
        superclassProto.constructor = superclass;
    }
    var subProtoMethod = Object.keys(subclassProto);

    Array.prototype.forEach.call(subProtoMethod, function (item) {
        if (subclassProto.hasOwnProperty(item)) {
            if (Object.prototype.toString.call(subclassProto[item]) == '[object Function]') {
                subclass.prototype[item] = subclassProto[item];
            }
        }
    });
    return subclass;
}