/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ (function(module) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per GeneratorResume behavior specified since ES2015:
        // ES2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
        // Latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next method, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable != null) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    throw new TypeError(typeof iterable + " is not iterable");
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "./src/arquivos/js/components/Exemple.js":
/*!***********************************************!*\
  !*** ./src/arquivos/js/components/Exemple.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Exemple; }
/* harmony export */ });
/* harmony import */ var _helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/waitForEl */ "./src/arquivos/js/helpers/waitForEl.js");
/* harmony import */ var _services_ServiceExemple__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/ServiceExemple */ "./src/arquivos/js/services/ServiceExemple.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");



class Exemple {
    serviceExemple = new _services_ServiceExemple__WEBPACK_IMPORTED_MODULE_1__["default"]()

    constructor() {
        this.init();
        this.selectors();
        this.events();
    }

    selectors() {
        this.title = $(".example-title");
    }

    events() {
        this.title.click(this.exempleEvent.bind(this));
    }

    init() {
        window.addEventListener("hashchange", () => {
            if (window.location.hash == "#/shipping") {
                (0,_helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__["default"])("#ship-complement")
                    .then
                    //develop
                    ();
            }
        });

        window.addEventListener("load", () => {
            if (window.location.hash != "#/cart") {
                (0,_helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__["default"])(".summary-cart-template-holder .hproduct .photo")
                    .then
                    //develop
                    ();
            }
        });

        $(window).on("orderFormUpdated.vtex", () => {
            if (window.location.hash != "#/cart") {
                (0,_helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__["default"])(".hproduct .photo").then(() => {
                    this.exempleMethod();
                });
            }
        });
    }

    exempleEvent(event) {
        console.log("event", event);
    }

    exempleMethod() {
        this.title.addClass("teste");
        this.serviceExemple.getAllInfoClient(1);
    }
}


/***/ }),

/***/ "./src/arquivos/js/helpers/waitForEl.js":
/*!**********************************************!*\
  !*** ./src/arquivos/js/helpers/waitForEl.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ waitForEl; }
/* harmony export */ });
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "jquery");
/**
 * Espera um elemento exitir no dom e executa o callback
 *
 * @param {string} selector seletor do elemento que dejesa esperar pela criação
 * @param {function} callback Função a ser executada quando tal elemento existir
 */

function waitForEl(selector) {
    return new Promise((resolve) => {
        function waitForElCb(s) {
            const el = jQuery(s);
            if (el.length) {
                resolve(el);
            } else {
                setTimeout(function () {
                    waitForElCb(selector);
                }, 100);
            }
        }
        waitForElCb(selector);
    });
}


/***/ }),

/***/ "./src/arquivos/js/lib/jquery.mask.min.js":
/*!************************************************!*\
  !*** ./src/arquivos/js/lib/jquery.mask.min.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable no-useless-escape */
/* eslint-disable no-cond-assign */
/* eslint-disable no-empty */
// jQuery Mask Plugin v1.14.16
// github.com/igorescobar/jQuery-Mask-Plugin
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function (a, n, f) {
    a instanceof String && (a = String(a));
    for (var p = a.length, k = 0; k < p; k++) {
        var b = a[k];
        if (n.call(f, b, k, a)) return { i: k, v: b };
    }
    return { i: -1, v: void 0 };
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty =
    $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, n, f) {
              a != Array.prototype && a != Object.prototype && (a[n] = f.value);
          };
$jscomp.getGlobal = function (a) {
    return "undefined" != typeof window && window === a
        ? a
        : "undefined" != typeof __webpack_require__.g && null != __webpack_require__.g
        ? __webpack_require__.g
        : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, n, f, p) {
    if (n) {
        f = $jscomp.global;
        a = a.split(".");
        for (p = 0; p < a.length - 1; p++) {
            var k = a[p];
            k in f || (f[k] = {});
            f = f[k];
        }
        a = a[a.length - 1];
        p = f[a];
        n = n(p);
        n != p &&
            null != n &&
            $jscomp.defineProperty(f, a, {
                configurable: !0,
                writable: !0,
                value: n,
            });
    }
};
$jscomp.polyfill(
    "Array.prototype.find",
    function (a) {
        return a
            ? a
            : function (a, f) {
                  return $jscomp.findInternal(this, a, f).v;
              };
    },
    "es6",
    "es3"
);
(function (a, n, f) {
     true
        ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (a),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
        : 0;
})(
    function (a) {
        var n = function (b, d, e) {
            var c = {
                invalid: [],
                getCaret: function () {
                    try {
                        var a = 0,
                            r = b.get(0),
                            h = document.selection,
                            d = r.selectionStart;
                        if (
                            h &&
                            -1 === navigator.appVersion.indexOf("MSIE 10")
                        ) {
                            var e = h.createRange();
                            e.moveStart("character", -c.val().length);
                            a = e.text.length;
                        } else if (d || "0" === d) a = d;
                        return a;
                    } catch (C) {}
                },
                setCaret: function (a) {
                    try {
                        if (b.is(":focus")) {
                            var c = b.get(0);
                            if (c.setSelectionRange) c.setSelectionRange(a, a);
                            else {
                                var g = c.createTextRange();
                                g.collapse(!0);
                                g.moveEnd("character", a);
                                g.moveStart("character", a);
                                g.select();
                            }
                        }
                    } catch (B) {}
                },
                events: function () {
                    b.on("keydown.mask", function (a) {
                        b.data("mask-keycode", a.keyCode || a.which);
                        b.data("mask-previus-value", b.val());
                        b.data("mask-previus-caret-pos", c.getCaret());
                        c.maskDigitPosMapOld = c.maskDigitPosMap;
                    })
                        .on(
                            a.jMaskGlobals.useInput
                                ? "input.mask"
                                : "keyup.mask",
                            c.behaviour
                        )
                        .on("paste.mask drop.mask", function () {
                            setTimeout(function () {
                                b.keydown().keyup();
                            }, 100);
                        })
                        .on("change.mask", function () {
                            b.data("changed", !0);
                        })
                        .on("blur.mask", function () {
                            f === c.val() ||
                                b.data("changed") ||
                                b.trigger("change");
                            b.data("changed", !1);
                        })
                        .on("blur.mask", function () {
                            f = c.val();
                        })
                        .on("focus.mask", function (b) {
                            !0 === e.selectOnFocus && a(b.target).select();
                        })
                        .on("focusout.mask", function () {
                            e.clearIfNotMatch && !k.test(c.val()) && c.val("");
                        });
                },
                getRegexMask: function () {
                    for (var a = [], b, c, e, t, f = 0; f < d.length; f++)
                        (b = l.translation[d.charAt(f)])
                            ? ((c = b.pattern
                                  .toString()
                                  .replace(/.{1}$|^.{1}/g, "")),
                              (e = b.optional),
                              (b = b.recursive)
                                  ? (a.push(d.charAt(f)),
                                    (t = { digit: d.charAt(f), pattern: c }))
                                  : a.push(e || b ? c + "?" : c))
                            : a.push(
                                  d
                                      .charAt(f)
                                      .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
                              );
                    a = a.join("");
                    t &&
                        (a = a
                            .replace(
                                new RegExp(
                                    "(" + t.digit + "(.*" + t.digit + ")?)"
                                ),
                                "($1)?"
                            )
                            .replace(new RegExp(t.digit, "g"), t.pattern));
                    return new RegExp(a);
                },
                destroyEvents: function () {
                    b.off(
                        "input keydown keyup paste drop blur focusout "
                            .split(" ")
                            .join(".mask ")
                    );
                },
                val: function (a) {
                    var c = b.is("input") ? "val" : "text";
                    if (0 < arguments.length) {
                        if (b[c]() !== a) b[c](a);
                        c = b;
                    } else c = b[c]();
                    return c;
                },
                calculateCaretPosition: function (a) {
                    var d = c.getMasked(),
                        h = c.getCaret();
                    if (a !== d) {
                        var e = b.data("mask-previus-caret-pos") || 0;
                        d = d.length;
                        var g = a.length,
                            f = (a = 0),
                            l = 0,
                            k = 0,
                            m;
                        for (m = h; m < d && c.maskDigitPosMap[m]; m++) f++;
                        for (m = h - 1; 0 <= m && c.maskDigitPosMap[m]; m--)
                            a++;
                        for (m = h - 1; 0 <= m; m--)
                            c.maskDigitPosMap[m] && l++;
                        for (m = e - 1; 0 <= m; m--)
                            c.maskDigitPosMapOld[m] && k++;
                        h > g
                            ? (h = 10 * d)
                            : e >= h && e !== g
                            ? c.maskDigitPosMapOld[h] ||
                              ((e = h),
                              (h = h - (k - l) - a),
                              c.maskDigitPosMap[h] && (h = e))
                            : h > e && (h = h + (l - k) + f);
                    }
                    return h;
                },
                behaviour: function (d) {
                    d = d || window.event;
                    c.invalid = [];
                    var e = b.data("mask-keycode");
                    if (-1 === a.inArray(e, l.byPassKeys)) {
                        e = c.getMasked();
                        var h = c.getCaret(),
                            g = b.data("mask-previus-value") || "";
                        setTimeout(function () {
                            c.setCaret(c.calculateCaretPosition(g));
                        }, a.jMaskGlobals.keyStrokeCompensation);
                        c.val(e);
                        c.setCaret(h);
                        return c.callbacks(d);
                    }
                },
                getMasked: function (a, b) {
                    var h = [],
                        f = void 0 === b ? c.val() : b + "",
                        g = 0,
                        k = d.length,
                        n = 0,
                        p = f.length,
                        m = 1,
                        r = "push",
                        u = -1,
                        w = 0;
                    b = [];
                    if (e.reverse) {
                        r = "unshift";
                        m = -1;
                        var x = 0;
                        g = k - 1;
                        n = p - 1;
                        var A = function () {
                            return -1 < g && -1 < n;
                        };
                    } else
                        (x = k - 1),
                            (A = function () {
                                return g < k && n < p;
                            });
                    for (var z; A(); ) {
                        var y = d.charAt(g),
                            v = f.charAt(n),
                            q = l.translation[y];
                        if (q)
                            v.match(q.pattern)
                                ? (h[r](v),
                                  q.recursive &&
                                      (-1 === u
                                          ? (u = g)
                                          : g === x && g !== u && (g = u - m),
                                      x === u && (g -= m)),
                                  (g += m))
                                : v === z
                                ? (w--, (z = void 0))
                                : q.optional
                                ? ((g += m), (n -= m))
                                : q.fallback
                                ? (h[r](q.fallback), (g += m), (n -= m))
                                : c.invalid.push({ p: n, v: v, e: q.pattern }),
                                (n += m);
                        else {
                            if (!a) h[r](y);
                            v === y
                                ? (b.push(n), (n += m))
                                : ((z = y), b.push(n + w), w++);
                            g += m;
                        }
                    }
                    a = d.charAt(x);
                    k !== p + 1 || l.translation[a] || h.push(a);
                    h = h.join("");
                    c.mapMaskdigitPositions(h, b, p);
                    return h;
                },
                mapMaskdigitPositions: function (a, b, d) {
                    a = e.reverse ? a.length - d : 0;
                    c.maskDigitPosMap = {};
                    for (d = 0; d < b.length; d++)
                        c.maskDigitPosMap[b[d] + a] = 1;
                },
                callbacks: function (a) {
                    var g = c.val(),
                        h = g !== f,
                        k = [g, a, b, e],
                        l = function (a, b, c) {
                            "function" === typeof e[a] &&
                                b &&
                                e[a].apply(this, c);
                        };
                    l("onChange", !0 === h, k);
                    l("onKeyPress", !0 === h, k);
                    l("onComplete", g.length === d.length, k);
                    l("onInvalid", 0 < c.invalid.length, [
                        g,
                        a,
                        b,
                        c.invalid,
                        e,
                    ]);
                },
            };
            b = a(b);
            var l = this,
                f = c.val(),
                k;
            d = "function" === typeof d ? d(c.val(), void 0, b, e) : d;
            l.mask = d;
            l.options = e;
            l.remove = function () {
                var a = c.getCaret();
                l.options.placeholder && b.removeAttr("placeholder");
                b.data("mask-maxlength") && b.removeAttr("maxlength");
                c.destroyEvents();
                c.val(l.getCleanVal());
                c.setCaret(a);
                return b;
            };
            l.getCleanVal = function () {
                return c.getMasked(!0);
            };
            l.getMaskedVal = function (a) {
                return c.getMasked(!1, a);
            };
            l.init = function (g) {
                g = g || !1;
                e = e || {};
                l.clearIfNotMatch = a.jMaskGlobals.clearIfNotMatch;
                l.byPassKeys = a.jMaskGlobals.byPassKeys;
                l.translation = a.extend(
                    {},
                    a.jMaskGlobals.translation,
                    e.translation
                );
                l = a.extend(!0, {}, l, e);
                k = c.getRegexMask();
                if (g) c.events(), c.val(c.getMasked());
                else {
                    e.placeholder && b.attr("placeholder", e.placeholder);
                    b.data("mask") && b.attr("autocomplete", "off");
                    g = 0;
                    for (var f = !0; g < d.length; g++) {
                        var h = l.translation[d.charAt(g)];
                        if (h && h.recursive) {
                            f = !1;
                            break;
                        }
                    }
                    f &&
                        b
                            .attr("maxlength", d.length)
                            .data("mask-maxlength", !0);
                    c.destroyEvents();
                    c.events();
                    g = c.getCaret();
                    c.val(c.getMasked());
                    c.setCaret(g);
                }
            };
            l.init(!b.is("input"));
        };
        a.maskWatchers = {};
        var f = function () {
                var b = a(this),
                    d = {},
                    e = b.attr("data-mask");
                b.attr("data-mask-reverse") && (d.reverse = !0);
                b.attr("data-mask-clearifnotmatch") && (d.clearIfNotMatch = !0);
                "true" === b.attr("data-mask-selectonfocus") &&
                    (d.selectOnFocus = !0);
                if (p(b, e, d)) return b.data("mask", new n(this, e, d));
            },
            p = function (b, d, e) {
                e = e || {};
                var c = a(b).data("mask"),
                    f = JSON.stringify;
                b = a(b).val() || a(b).text();
                try {
                    return (
                        "function" === typeof d && (d = d(b)),
                        "object" !== typeof c ||
                            f(c.options) !== f(e) ||
                            c.mask !== d
                    );
                } catch (w) {}
            },
            k = function (a) {
                var b = document.createElement("div");
                a = "on" + a;
                var e = a in b;
                e ||
                    (b.setAttribute(a, "return;"),
                    (e = "function" === typeof b[a]));
                return e;
            };
        a.fn.mask = function (b, d) {
            d = d || {};
            var e = this.selector,
                c = a.jMaskGlobals,
                f = c.watchInterval;
            c = d.watchInputs || c.watchInputs;
            var k = function () {
                if (p(this, b, d))
                    return a(this).data("mask", new n(this, b, d));
            };
            a(this).each(k);
            e &&
                "" !== e &&
                c &&
                (clearInterval(a.maskWatchers[e]),
                (a.maskWatchers[e] = setInterval(function () {
                    a(document).find(e).each(k);
                }, f)));
            return this;
        };
        a.fn.masked = function (a) {
            return this.data("mask").getMaskedVal(a);
        };
        a.fn.unmask = function () {
            clearInterval(a.maskWatchers[this.selector]);
            delete a.maskWatchers[this.selector];
            return this.each(function () {
                var b = a(this).data("mask");
                b && b.remove().removeData("mask");
            });
        };
        a.fn.cleanVal = function () {
            return this.data("mask").getCleanVal();
        };
        a.applyDataMask = function (b) {
            b = b || a.jMaskGlobals.maskElements;
            (b instanceof a ? b : a(b))
                .filter(a.jMaskGlobals.dataMaskAttr)
                .each(f);
        };
        k = {
            maskElements: "input,td,span,div",
            dataMaskAttr: "*[data-mask]",
            dataMask: !0,
            watchInterval: 300,
            watchInputs: !0,
            keyStrokeCompensation: 10,
            useInput:
                !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(
                    window.navigator.userAgent
                ) && k("input"),
            watchDataMask: !1,
            byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
            translation: {
                0: { pattern: /\d/ },
                9: { pattern: /\d/, optional: !0 },
                "#": { pattern: /\d/, recursive: !0 },
                A: { pattern: /[a-zA-Z0-9]/ },
                S: { pattern: /[a-zA-Z]/ },
            },
        };
        a.jMaskGlobals = a.jMaskGlobals || {};
        k = a.jMaskGlobals = a.extend(!0, {}, k, a.jMaskGlobals);
        k.dataMask && a.applyDataMask();
        setInterval(function () {
            a.jMaskGlobals.watchDataMask && a.applyDataMask();
        }, k.watchInterval);
    },
    window.jQuery,
    window.Zepto
);


/***/ }),

/***/ "./src/arquivos/js/services/ServiceExemple.js":
/*!****************************************************!*\
  !*** ./src/arquivos/js/services/ServiceExemple.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ServiceExemple; }
/* harmony export */ });
class ServiceExemple {
    //esse eh um exemplo de service
    //essa rota, eh um exemplo de rota declarada dentro do service node
    //os services servem para consumir apis e apis privadas
    async getAllInfoClient(id) {
        const data = await fetch(
            `/clientapi/getInfoClient/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        return data.json();
    }
}

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ (function(module) {

"use strict";
module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!*************************************!*\
  !*** ./src/arquivos/js/checkout.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Exemple_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Exemple.js */ "./src/arquivos/js/components/Exemple.js");
/* harmony import */ var _lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/jquery.mask.min.js */ "./src/arquivos/js/lib/jquery.mask.min.js");
/* harmony import */ var _lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_2__);




class Checkout {
    constructor() {
        this.init();
    }

    init() {
        new _components_Exemple_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
    }
}

new Checkout();

(function () {
    var script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "//suite.linximpulse.net/impulse/impulse.js";
    script.setAttribute("data-apikey", "padovani");
    document.head.appendChild(script);
})();

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tvdXQ2LWN1c3RvbS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEVBQTRFO0FBQzVFLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJDQUEyQyxpREFBaUQ7O0FBRTVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsTUFBTTtBQUNOLGVBQWU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsdURBQXVEO0FBQzdGO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0MsZ0JBQWdCO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxjQUFjO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixnQkFBZ0I7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUEsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FB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QUNpQjtBQUNaOztBQUVsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVksOERBQU87QUFDbkI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGVja291dC8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvLi9zcmMvYXJxdWl2b3MvanMvY29tcG9uZW50cy9FeGVtcGxlLmpzIiwid2VicGFjazovL2NoZWNrb3V0Ly4vc3JjL2FycXVpdm9zL2pzL2hlbHBlcnMvd2FpdEZvckVsLmpzIiwid2VicGFjazovL2NoZWNrb3V0Ly4vc3JjL2FycXVpdm9zL2pzL2xpYi9qcXVlcnkubWFzay5taW4uanMiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvLi9zcmMvYXJxdWl2b3MvanMvc2VydmljZXMvU2VydmljZUV4ZW1wbGUuanMiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvZXh0ZXJuYWwgdmFyIFwialF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NoZWNrb3V0L3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jaGVja291dC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NoZWNrb3V0Ly4vc3JjL2FycXVpdm9zL2pzL2NoZWNrb3V0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgfHwgZnVuY3Rpb24gKG9iaiwga2V5LCBkZXNjKSB7IG9ialtrZXldID0gZGVzYy52YWx1ZTsgfTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gZGVmaW5lKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIG9ialtrZXldO1xuICB9XG4gIHRyeSB7XG4gICAgLy8gSUUgOCBoYXMgYSBicm9rZW4gT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoYXQgb25seSB3b3JrcyBvbiBET00gb2JqZWN0cy5cbiAgICBkZWZpbmUoe30sIFwiXCIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBkZWZpbmUgPSBmdW5jdGlvbihvYmosIGtleSwgdmFsdWUpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XSA9IHZhbHVlO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZGVmaW5lUHJvcGVydHkoZ2VuZXJhdG9yLCBcIl9pbnZva2VcIiwgeyB2YWx1ZTogbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB9KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgZGVmaW5lKEl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBkZWZpbmVQcm9wZXJ0eShHcCwgXCJjb25zdHJ1Y3RvclwiLCB7IHZhbHVlOiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSwgY29uZmlndXJhYmxlOiB0cnVlIH0pO1xuICBkZWZpbmVQcm9wZXJ0eShcbiAgICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSxcbiAgICBcImNvbnN0cnVjdG9yXCIsXG4gICAgeyB2YWx1ZTogR2VuZXJhdG9yRnVuY3Rpb24sIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9XG4gICk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIl9pbnZva2VcIiwgeyB2YWx1ZTogZW5xdWV1ZSB9KTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIGRlZmluZShBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSwgYXN5bmNJdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIEdlbmVyYXRvclJlc3VtZSBiZWhhdmlvciBzcGVjaWZpZWQgc2luY2UgRVMyMDE1OlxuICAgICAgICAvLyBFUzIwMTUgc3BlYywgc3RlcCAzOiBodHRwczovLzI2Mi5lY21hLWludGVybmF0aW9uYWwub3JnLzYuMC8jc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICAvLyBMYXRlc3Qgc3BlYywgc3RlcCAyOiBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZE5hbWUgPSBjb250ZXh0Lm1ldGhvZDtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kTmFtZV07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCwgb3IgYSBtaXNzaW5nIC5uZXh0IG1ldGhvZCwgYWx3YXlzIHRlcm1pbmF0ZSB0aGVcbiAgICAgIC8vIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICBpZiAobWV0aG9kTmFtZSA9PT0gXCJ0aHJvd1wiICYmIGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZXRob2ROYW1lICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICdcIiArIG1ldGhvZE5hbWUgKyBcIicgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIGRlZmluZShHcCwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yXCIpO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgZGVmaW5lKEdwLCBpdGVyYXRvclN5bWJvbCwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIGRlZmluZShHcCwgXCJ0b1N0cmluZ1wiLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbih2YWwpIHtcbiAgICB2YXIgb2JqZWN0ID0gT2JqZWN0KHZhbCk7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSAhPSBudWxsKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IodHlwZW9mIGl0ZXJhYmxlICsgXCIgaXMgbm90IGl0ZXJhYmxlXCIpO1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIGluIG1vZGVybiBlbmdpbmVzXG4gIC8vIHdlIGNhbiBleHBsaWNpdGx5IGFjY2VzcyBnbG9iYWxUaGlzLiBJbiBvbGRlciBlbmdpbmVzIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbFRoaXMucmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbiAgfSBlbHNlIHtcbiAgICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xuICB9XG59XG4iLCJpbXBvcnQgd2FpdEZvckVsIGZyb20gXCIuLi9oZWxwZXJzL3dhaXRGb3JFbFwiO1xuaW1wb3J0IFNlcnZpY2VFeGVtcGxlIGZyb20gXCIuLi9zZXJ2aWNlcy9TZXJ2aWNlRXhlbXBsZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeGVtcGxlIHtcbiAgICBzZXJ2aWNlRXhlbXBsZSA9IG5ldyBTZXJ2aWNlRXhlbXBsZSgpXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JzKCk7XG4gICAgICAgIHRoaXMuZXZlbnRzKCk7XG4gICAgfVxuXG4gICAgc2VsZWN0b3JzKCkge1xuICAgICAgICB0aGlzLnRpdGxlID0gJChcIi5leGFtcGxlLXRpdGxlXCIpO1xuICAgIH1cblxuICAgIGV2ZW50cygpIHtcbiAgICAgICAgdGhpcy50aXRsZS5jbGljayh0aGlzLmV4ZW1wbGVFdmVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoID09IFwiIy9zaGlwcGluZ1wiKSB7XG4gICAgICAgICAgICAgICAgd2FpdEZvckVsKFwiI3NoaXAtY29tcGxlbWVudFwiKVxuICAgICAgICAgICAgICAgICAgICAudGhlblxuICAgICAgICAgICAgICAgICAgICAvL2RldmVsb3BcbiAgICAgICAgICAgICAgICAgICAgKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggIT0gXCIjL2NhcnRcIikge1xuICAgICAgICAgICAgICAgIHdhaXRGb3JFbChcIi5zdW1tYXJ5LWNhcnQtdGVtcGxhdGUtaG9sZGVyIC5ocHJvZHVjdCAucGhvdG9cIilcbiAgICAgICAgICAgICAgICAgICAgLnRoZW5cbiAgICAgICAgICAgICAgICAgICAgLy9kZXZlbG9wXG4gICAgICAgICAgICAgICAgICAgICgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKHdpbmRvdykub24oXCJvcmRlckZvcm1VcGRhdGVkLnZ0ZXhcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9IFwiIy9jYXJ0XCIpIHtcbiAgICAgICAgICAgICAgICB3YWl0Rm9yRWwoXCIuaHByb2R1Y3QgLnBob3RvXCIpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4ZW1wbGVNZXRob2QoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXhlbXBsZUV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXZlbnRcIiwgZXZlbnQpO1xuICAgIH1cblxuICAgIGV4ZW1wbGVNZXRob2QoKSB7XG4gICAgICAgIHRoaXMudGl0bGUuYWRkQ2xhc3MoXCJ0ZXN0ZVwiKTtcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXhlbXBsZS5nZXRBbGxJbmZvQ2xpZW50KDEpO1xuICAgIH1cbn1cbiIsIi8qKlxuICogRXNwZXJhIHVtIGVsZW1lbnRvIGV4aXRpciBubyBkb20gZSBleGVjdXRhIG8gY2FsbGJhY2tcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3Igc2VsZXRvciBkbyBlbGVtZW50byBxdWUgZGVqZXNhIGVzcGVyYXIgcGVsYSBjcmlhw6fDo29cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIEZ1bsOnw6NvIGEgc2VyIGV4ZWN1dGFkYSBxdWFuZG8gdGFsIGVsZW1lbnRvIGV4aXN0aXJcbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3YWl0Rm9yRWwoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgZnVuY3Rpb24gd2FpdEZvckVsQ2Iocykge1xuICAgICAgICAgICAgY29uc3QgZWwgPSBqUXVlcnkocyk7XG4gICAgICAgICAgICBpZiAoZWwubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShlbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB3YWl0Rm9yRWxDYihzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3YWl0Rm9yRWxDYihzZWxlY3Rvcik7XG4gICAgfSk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11c2VsZXNzLWVzY2FwZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tY29uZC1hc3NpZ24gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXG4vLyBqUXVlcnkgTWFzayBQbHVnaW4gdjEuMTQuMTZcbi8vIGdpdGh1Yi5jb20vaWdvcmVzY29iYXIvalF1ZXJ5LU1hc2stUGx1Z2luXG52YXIgJGpzY29tcCA9ICRqc2NvbXAgfHwge307XG4kanNjb21wLnNjb3BlID0ge307XG4kanNjb21wLmZpbmRJbnRlcm5hbCA9IGZ1bmN0aW9uIChhLCBuLCBmKSB7XG4gICAgYSBpbnN0YW5jZW9mIFN0cmluZyAmJiAoYSA9IFN0cmluZyhhKSk7XG4gICAgZm9yICh2YXIgcCA9IGEubGVuZ3RoLCBrID0gMDsgayA8IHA7IGsrKykge1xuICAgICAgICB2YXIgYiA9IGFba107XG4gICAgICAgIGlmIChuLmNhbGwoZiwgYiwgaywgYSkpIHJldHVybiB7IGk6IGssIHY6IGIgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgaTogLTEsIHY6IHZvaWQgMCB9O1xufTtcbiRqc2NvbXAuQVNTVU1FX0VTNSA9ICExO1xuJGpzY29tcC5BU1NVTUVfTk9fTkFUSVZFX01BUCA9ICExO1xuJGpzY29tcC5BU1NVTUVfTk9fTkFUSVZFX1NFVCA9ICExO1xuJGpzY29tcC5TSU1QTEVfRlJPVU5EX1BPTFlGSUxMID0gITE7XG4kanNjb21wLmRlZmluZVByb3BlcnR5ID1cbiAgICAkanNjb21wLkFTU1VNRV9FUzUgfHwgXCJmdW5jdGlvblwiID09IHR5cGVvZiBPYmplY3QuZGVmaW5lUHJvcGVydGllc1xuICAgICAgICA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuICAgICAgICA6IGZ1bmN0aW9uIChhLCBuLCBmKSB7XG4gICAgICAgICAgICAgIGEgIT0gQXJyYXkucHJvdG90eXBlICYmIGEgIT0gT2JqZWN0LnByb3RvdHlwZSAmJiAoYVtuXSA9IGYudmFsdWUpO1xuICAgICAgICAgIH07XG4kanNjb21wLmdldEdsb2JhbCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgcmV0dXJuIFwidW5kZWZpbmVkXCIgIT0gdHlwZW9mIHdpbmRvdyAmJiB3aW5kb3cgPT09IGFcbiAgICAgICAgPyBhXG4gICAgICAgIDogXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2YgZ2xvYmFsICYmIG51bGwgIT0gZ2xvYmFsXG4gICAgICAgID8gZ2xvYmFsXG4gICAgICAgIDogYTtcbn07XG4kanNjb21wLmdsb2JhbCA9ICRqc2NvbXAuZ2V0R2xvYmFsKHRoaXMpO1xuJGpzY29tcC5wb2x5ZmlsbCA9IGZ1bmN0aW9uIChhLCBuLCBmLCBwKSB7XG4gICAgaWYgKG4pIHtcbiAgICAgICAgZiA9ICRqc2NvbXAuZ2xvYmFsO1xuICAgICAgICBhID0gYS5zcGxpdChcIi5cIik7XG4gICAgICAgIGZvciAocCA9IDA7IHAgPCBhLmxlbmd0aCAtIDE7IHArKykge1xuICAgICAgICAgICAgdmFyIGsgPSBhW3BdO1xuICAgICAgICAgICAgayBpbiBmIHx8IChmW2tdID0ge30pO1xuICAgICAgICAgICAgZiA9IGZba107XG4gICAgICAgIH1cbiAgICAgICAgYSA9IGFbYS5sZW5ndGggLSAxXTtcbiAgICAgICAgcCA9IGZbYV07XG4gICAgICAgIG4gPSBuKHApO1xuICAgICAgICBuICE9IHAgJiZcbiAgICAgICAgICAgIG51bGwgIT0gbiAmJlxuICAgICAgICAgICAgJGpzY29tcC5kZWZpbmVQcm9wZXJ0eShmLCBhLCB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiAhMCxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgICAgICAgICAgdmFsdWU6IG4sXG4gICAgICAgICAgICB9KTtcbiAgICB9XG59O1xuJGpzY29tcC5wb2x5ZmlsbChcbiAgICBcIkFycmF5LnByb3RvdHlwZS5maW5kXCIsXG4gICAgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIGFcbiAgICAgICAgICAgID8gYVxuICAgICAgICAgICAgOiBmdW5jdGlvbiAoYSwgZikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICRqc2NvbXAuZmluZEludGVybmFsKHRoaXMsIGEsIGYpLnY7XG4gICAgICAgICAgICAgIH07XG4gICAgfSxcbiAgICBcImVzNlwiLFxuICAgIFwiZXMzXCJcbik7XG4oZnVuY3Rpb24gKGEsIG4sIGYpIHtcbiAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZFxuICAgICAgICA/IGRlZmluZShbXCJqcXVlcnlcIl0sIGEpXG4gICAgICAgIDogXCJvYmplY3RcIiA9PT0gdHlwZW9mIGV4cG9ydHMgJiYgXCJ1bmRlZmluZWRcIiA9PT0gdHlwZW9mIE1ldGVvclxuICAgICAgICA/IChtb2R1bGUuZXhwb3J0cyA9IGEocmVxdWlyZShcImpxdWVyeVwiKSkpXG4gICAgICAgIDogYShuIHx8IGYpO1xufSkoXG4gICAgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgdmFyIG4gPSBmdW5jdGlvbiAoYiwgZCwgZSkge1xuICAgICAgICAgICAgdmFyIGMgPSB7XG4gICAgICAgICAgICAgICAgaW52YWxpZDogW10sXG4gICAgICAgICAgICAgICAgZ2V0Q2FyZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByID0gYi5nZXQoMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCA9IGRvY3VtZW50LnNlbGVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkID0gci5zZWxlY3Rpb25TdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLTEgPT09IG5hdmlnYXRvci5hcHBWZXJzaW9uLmluZGV4T2YoXCJNU0lFIDEwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGguY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCAtYy52YWwoKS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBlLnRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkIHx8IFwiMFwiID09PSBkKSBhID0gZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChDKSB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2V0Q2FyZXQ6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYi5pcyhcIjpmb2N1c1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gYi5nZXQoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMuc2V0U2VsZWN0aW9uUmFuZ2UpIGMuc2V0U2VsZWN0aW9uUmFuZ2UoYSwgYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnID0gYy5jcmVhdGVUZXh0UmFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5jb2xsYXBzZSghMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcubW92ZUVuZChcImNoYXJhY3RlclwiLCBhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5tb3ZlU3RhcnQoXCJjaGFyYWN0ZXJcIiwgYSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChCKSB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGIub24oXCJrZXlkb3duLm1hc2tcIiwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIuZGF0YShcIm1hc2sta2V5Y29kZVwiLCBhLmtleUNvZGUgfHwgYS53aGljaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBiLmRhdGEoXCJtYXNrLXByZXZpdXMtdmFsdWVcIiwgYi52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBiLmRhdGEoXCJtYXNrLXByZXZpdXMtY2FyZXQtcG9zXCIsIGMuZ2V0Q2FyZXQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLm1hc2tEaWdpdFBvc01hcE9sZCA9IGMubWFza0RpZ2l0UG9zTWFwO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEuak1hc2tHbG9iYWxzLnVzZUlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJpbnB1dC5tYXNrXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcImtleXVwLm1hc2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmJlaGF2aW91clxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwicGFzdGUubWFzayBkcm9wLm1hc2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLmtleWRvd24oKS5rZXl1cCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwiY2hhbmdlLm1hc2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuZGF0YShcImNoYW5nZWRcIiwgITApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcImJsdXIubWFza1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9PT0gYy52YWwoKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLmRhdGEoXCJjaGFuZ2VkXCIpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiLmRhdGEoXCJjaGFuZ2VkXCIsICExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJibHVyLm1hc2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBjLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcImZvY3VzLm1hc2tcIiwgZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhMCA9PT0gZS5zZWxlY3RPbkZvY3VzICYmIGEoYi50YXJnZXQpLnNlbGVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcImZvY3Vzb3V0Lm1hc2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xlYXJJZk5vdE1hdGNoICYmICFrLnRlc3QoYy52YWwoKSkgJiYgYy52YWwoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldFJlZ2V4TWFzazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gW10sIGIsIGMsIGUsIHQsIGYgPSAwOyBmIDwgZC5sZW5ndGg7IGYrKylcbiAgICAgICAgICAgICAgICAgICAgICAgIChiID0gbC50cmFuc2xhdGlvbltkLmNoYXJBdChmKV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoKGMgPSBiLnBhdHRlcm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8uezF9JHxeLnsxfS9nLCBcIlwiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZSA9IGIub3B0aW9uYWwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGIgPSBiLnJlY3Vyc2l2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChhLnB1c2goZC5jaGFyQXQoZikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHQgPSB7IGRpZ2l0OiBkLmNoYXJBdChmKSwgcGF0dGVybjogYyB9KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGEucHVzaChlIHx8IGIgPyBjICsgXCI/XCIgOiBjKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGEucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGFyQXQoZilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgXCJcXFxcJCZcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGEgPSBhLmpvaW4oXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIHQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIChhID0gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIoXCIgKyB0LmRpZ2l0ICsgXCIoLipcIiArIHQuZGlnaXQgKyBcIik/KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiKCQxKT9cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKHQuZGlnaXQsIFwiZ1wiKSwgdC5wYXR0ZXJuKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGEpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVzdHJveUV2ZW50czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBiLm9mZihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5wdXQga2V5ZG93biBrZXl1cCBwYXN0ZSBkcm9wIGJsdXIgZm9jdXNvdXQgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oXCIubWFzayBcIilcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHZhbDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBiLmlzKFwiaW5wdXRcIikgPyBcInZhbFwiIDogXCJ0ZXh0XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICgwIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJbY10oKSAhPT0gYSkgYltjXShhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgYyA9IGJbY10oKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVDYXJldFBvc2l0aW9uOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZCA9IGMuZ2V0TWFza2VkKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBoID0gYy5nZXRDYXJldCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSAhPT0gZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBiLmRhdGEoXCJtYXNrLXByZXZpdXMtY2FyZXQtcG9zXCIpIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZyA9IGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYgPSAoYSA9IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGwgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG0gPSBoOyBtIDwgZCAmJiBjLm1hc2tEaWdpdFBvc01hcFttXTsgbSsrKSBmKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG0gPSBoIC0gMTsgMCA8PSBtICYmIGMubWFza0RpZ2l0UG9zTWFwW21dOyBtLS0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChtID0gaCAtIDE7IDAgPD0gbTsgbS0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubWFza0RpZ2l0UG9zTWFwW21dICYmIGwrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobSA9IGUgLSAxOyAwIDw9IG07IG0tLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLm1hc2tEaWdpdFBvc01hcE9sZFttXSAmJiBrKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBoID4gZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGggPSAxMCAqIGQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBlID49IGggJiYgZSAhPT0gZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYy5tYXNrRGlnaXRQb3NNYXBPbGRbaF0gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZSA9IGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGggPSBoIC0gKGsgLSBsKSAtIGEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5tYXNrRGlnaXRQb3NNYXBbaF0gJiYgKGggPSBlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGggPiBlICYmIChoID0gaCArIChsIC0gaykgKyBmKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJlaGF2aW91cjogZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IGQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgICAgICAgICAgICBjLmludmFsaWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSBiLmRhdGEoXCJtYXNrLWtleWNvZGVcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmICgtMSA9PT0gYS5pbkFycmF5KGUsIGwuYnlQYXNzS2V5cykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBjLmdldE1hc2tlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGggPSBjLmdldENhcmV0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZyA9IGIuZGF0YShcIm1hc2stcHJldml1cy12YWx1ZVwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5zZXRDYXJldChjLmNhbGN1bGF0ZUNhcmV0UG9zaXRpb24oZykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgYS5qTWFza0dsb2JhbHMua2V5U3Ryb2tlQ29tcGVuc2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMudmFsKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5zZXRDYXJldChoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLmNhbGxiYWNrcyhkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0TWFza2VkOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9IHZvaWQgMCA9PT0gYiA/IGMudmFsKCkgOiBiICsgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGcgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgbiA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBwID0gZi5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBtID0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBcInB1c2hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHcgPSAwO1xuICAgICAgICAgICAgICAgICAgICBiID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnJldmVyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBcInVuc2hpZnRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcgPSBrIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gPSBwIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBBID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMSA8IGcgJiYgLTEgPCBuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAoeCA9IGsgLSAxKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoQSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGcgPCBrICYmIG4gPCBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB6OyBBKCk7ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHkgPSBkLmNoYXJBdChnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gZi5jaGFyQXQobiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcSA9IGwudHJhbnNsYXRpb25beV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2Lm1hdGNoKHEucGF0dGVybilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoaFtyXSh2KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLnJlY3Vyc2l2ZSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoLTEgPT09IHVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKHUgPSBnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBnID09PSB4ICYmIGcgIT09IHUgJiYgKGcgPSB1IC0gbSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHggPT09IHUgJiYgKGcgLT0gbSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnICs9IG0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHYgPT09IHpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAody0tLCAoeiA9IHZvaWQgMCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcS5vcHRpb25hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICgoZyArPSBtKSwgKG4gLT0gbSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcS5mYWxsYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChoW3JdKHEuZmFsbGJhY2spLCAoZyArPSBtKSwgKG4gLT0gbSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYy5pbnZhbGlkLnB1c2goeyBwOiBuLCB2OiB2LCBlOiBxLnBhdHRlcm4gfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChuICs9IG0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhKSBoW3JdKHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPT09IHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoYi5wdXNoKG4pLCAobiArPSBtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoKHogPSB5KSwgYi5wdXNoKG4gKyB3KSwgdysrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnICs9IG07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYSA9IGQuY2hhckF0KHgpO1xuICAgICAgICAgICAgICAgICAgICBrICE9PSBwICsgMSB8fCBsLnRyYW5zbGF0aW9uW2FdIHx8IGgucHVzaChhKTtcbiAgICAgICAgICAgICAgICAgICAgaCA9IGguam9pbihcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgYy5tYXBNYXNrZGlnaXRQb3NpdGlvbnMoaCwgYiwgcCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbWFwTWFza2RpZ2l0UG9zaXRpb25zOiBmdW5jdGlvbiAoYSwgYiwgZCkge1xuICAgICAgICAgICAgICAgICAgICBhID0gZS5yZXZlcnNlID8gYS5sZW5ndGggLSBkIDogMDtcbiAgICAgICAgICAgICAgICAgICAgYy5tYXNrRGlnaXRQb3NNYXAgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChkID0gMDsgZCA8IGIubGVuZ3RoOyBkKyspXG4gICAgICAgICAgICAgICAgICAgICAgICBjLm1hc2tEaWdpdFBvc01hcFtiW2RdICsgYV0gPSAxO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZyA9IGMudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBoID0gZyAhPT0gZixcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgPSBbZywgYSwgYiwgZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsID0gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBlW2FdICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZVthXS5hcHBseSh0aGlzLCBjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGwoXCJvbkNoYW5nZVwiLCAhMCA9PT0gaCwgayk7XG4gICAgICAgICAgICAgICAgICAgIGwoXCJvbktleVByZXNzXCIsICEwID09PSBoLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgbChcIm9uQ29tcGxldGVcIiwgZy5sZW5ndGggPT09IGQubGVuZ3RoLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgbChcIm9uSW52YWxpZFwiLCAwIDwgYy5pbnZhbGlkLmxlbmd0aCwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYy5pbnZhbGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBiID0gYShiKTtcbiAgICAgICAgICAgIHZhciBsID0gdGhpcyxcbiAgICAgICAgICAgICAgICBmID0gYy52YWwoKSxcbiAgICAgICAgICAgICAgICBrO1xuICAgICAgICAgICAgZCA9IFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIGQgPyBkKGMudmFsKCksIHZvaWQgMCwgYiwgZSkgOiBkO1xuICAgICAgICAgICAgbC5tYXNrID0gZDtcbiAgICAgICAgICAgIGwub3B0aW9ucyA9IGU7XG4gICAgICAgICAgICBsLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGMuZ2V0Q2FyZXQoKTtcbiAgICAgICAgICAgICAgICBsLm9wdGlvbnMucGxhY2Vob2xkZXIgJiYgYi5yZW1vdmVBdHRyKFwicGxhY2Vob2xkZXJcIik7XG4gICAgICAgICAgICAgICAgYi5kYXRhKFwibWFzay1tYXhsZW5ndGhcIikgJiYgYi5yZW1vdmVBdHRyKFwibWF4bGVuZ3RoXCIpO1xuICAgICAgICAgICAgICAgIGMuZGVzdHJveUV2ZW50cygpO1xuICAgICAgICAgICAgICAgIGMudmFsKGwuZ2V0Q2xlYW5WYWwoKSk7XG4gICAgICAgICAgICAgICAgYy5zZXRDYXJldChhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsLmdldENsZWFuVmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjLmdldE1hc2tlZCghMCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbC5nZXRNYXNrZWRWYWwgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjLmdldE1hc2tlZCghMSwgYSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbC5pbml0ID0gZnVuY3Rpb24gKGcpIHtcbiAgICAgICAgICAgICAgICBnID0gZyB8fCAhMTtcbiAgICAgICAgICAgICAgICBlID0gZSB8fCB7fTtcbiAgICAgICAgICAgICAgICBsLmNsZWFySWZOb3RNYXRjaCA9IGEuak1hc2tHbG9iYWxzLmNsZWFySWZOb3RNYXRjaDtcbiAgICAgICAgICAgICAgICBsLmJ5UGFzc0tleXMgPSBhLmpNYXNrR2xvYmFscy5ieVBhc3NLZXlzO1xuICAgICAgICAgICAgICAgIGwudHJhbnNsYXRpb24gPSBhLmV4dGVuZChcbiAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgIGEuak1hc2tHbG9iYWxzLnRyYW5zbGF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBlLnRyYW5zbGF0aW9uXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBsID0gYS5leHRlbmQoITAsIHt9LCBsLCBlKTtcbiAgICAgICAgICAgICAgICBrID0gYy5nZXRSZWdleE1hc2soKTtcbiAgICAgICAgICAgICAgICBpZiAoZykgYy5ldmVudHMoKSwgYy52YWwoYy5nZXRNYXNrZWQoKSk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGUucGxhY2Vob2xkZXIgJiYgYi5hdHRyKFwicGxhY2Vob2xkZXJcIiwgZS5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgICAgIGIuZGF0YShcIm1hc2tcIikgJiYgYi5hdHRyKFwiYXV0b2NvbXBsZXRlXCIsIFwib2ZmXCIpO1xuICAgICAgICAgICAgICAgICAgICBnID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgZiA9ICEwOyBnIDwgZC5sZW5ndGg7IGcrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGggPSBsLnRyYW5zbGF0aW9uW2QuY2hhckF0KGcpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoICYmIGgucmVjdXJzaXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9ICExO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGYgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcIm1heGxlbmd0aFwiLCBkLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YShcIm1hc2stbWF4bGVuZ3RoXCIsICEwKTtcbiAgICAgICAgICAgICAgICAgICAgYy5kZXN0cm95RXZlbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIGMuZXZlbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIGcgPSBjLmdldENhcmV0KCk7XG4gICAgICAgICAgICAgICAgICAgIGMudmFsKGMuZ2V0TWFza2VkKCkpO1xuICAgICAgICAgICAgICAgICAgICBjLnNldENhcmV0KGcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsLmluaXQoIWIuaXMoXCJpbnB1dFwiKSk7XG4gICAgICAgIH07XG4gICAgICAgIGEubWFza1dhdGNoZXJzID0ge307XG4gICAgICAgIHZhciBmID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBiID0gYSh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgZCA9IHt9LFxuICAgICAgICAgICAgICAgICAgICBlID0gYi5hdHRyKFwiZGF0YS1tYXNrXCIpO1xuICAgICAgICAgICAgICAgIGIuYXR0cihcImRhdGEtbWFzay1yZXZlcnNlXCIpICYmIChkLnJldmVyc2UgPSAhMCk7XG4gICAgICAgICAgICAgICAgYi5hdHRyKFwiZGF0YS1tYXNrLWNsZWFyaWZub3RtYXRjaFwiKSAmJiAoZC5jbGVhcklmTm90TWF0Y2ggPSAhMCk7XG4gICAgICAgICAgICAgICAgXCJ0cnVlXCIgPT09IGIuYXR0cihcImRhdGEtbWFzay1zZWxlY3RvbmZvY3VzXCIpICYmXG4gICAgICAgICAgICAgICAgICAgIChkLnNlbGVjdE9uRm9jdXMgPSAhMCk7XG4gICAgICAgICAgICAgICAgaWYgKHAoYiwgZSwgZCkpIHJldHVybiBiLmRhdGEoXCJtYXNrXCIsIG5ldyBuKHRoaXMsIGUsIGQpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwID0gZnVuY3Rpb24gKGIsIGQsIGUpIHtcbiAgICAgICAgICAgICAgICBlID0gZSB8fCB7fTtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGEoYikuZGF0YShcIm1hc2tcIiksXG4gICAgICAgICAgICAgICAgICAgIGYgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgICAgICAgICAgICBiID0gYShiKS52YWwoKSB8fCBhKGIpLnRleHQoKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgZCAmJiAoZCA9IGQoYikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJvYmplY3RcIiAhPT0gdHlwZW9mIGMgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmKGMub3B0aW9ucykgIT09IGYoZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLm1hc2sgIT09IGRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoICh3KSB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGsgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgIHZhciBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBhID0gXCJvblwiICsgYTtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGEgaW4gYjtcbiAgICAgICAgICAgICAgICBlIHx8XG4gICAgICAgICAgICAgICAgICAgIChiLnNldEF0dHJpYnV0ZShhLCBcInJldHVybjtcIiksXG4gICAgICAgICAgICAgICAgICAgIChlID0gXCJmdW5jdGlvblwiID09PSB0eXBlb2YgYlthXSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgYS5mbi5tYXNrID0gZnVuY3Rpb24gKGIsIGQpIHtcbiAgICAgICAgICAgIGQgPSBkIHx8IHt9O1xuICAgICAgICAgICAgdmFyIGUgPSB0aGlzLnNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIGMgPSBhLmpNYXNrR2xvYmFscyxcbiAgICAgICAgICAgICAgICBmID0gYy53YXRjaEludGVydmFsO1xuICAgICAgICAgICAgYyA9IGQud2F0Y2hJbnB1dHMgfHwgYy53YXRjaElucHV0cztcbiAgICAgICAgICAgIHZhciBrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChwKHRoaXMsIGIsIGQpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSh0aGlzKS5kYXRhKFwibWFza1wiLCBuZXcgbih0aGlzLCBiLCBkKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYSh0aGlzKS5lYWNoKGspO1xuICAgICAgICAgICAgZSAmJlxuICAgICAgICAgICAgICAgIFwiXCIgIT09IGUgJiZcbiAgICAgICAgICAgICAgICBjICYmXG4gICAgICAgICAgICAgICAgKGNsZWFySW50ZXJ2YWwoYS5tYXNrV2F0Y2hlcnNbZV0pLFxuICAgICAgICAgICAgICAgIChhLm1hc2tXYXRjaGVyc1tlXSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYShkb2N1bWVudCkuZmluZChlKS5lYWNoKGspO1xuICAgICAgICAgICAgICAgIH0sIGYpKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICAgICAgYS5mbi5tYXNrZWQgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YShcIm1hc2tcIikuZ2V0TWFza2VkVmFsKGEpO1xuICAgICAgICB9O1xuICAgICAgICBhLmZuLnVubWFzayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoYS5tYXNrV2F0Y2hlcnNbdGhpcy5zZWxlY3Rvcl0pO1xuICAgICAgICAgICAgZGVsZXRlIGEubWFza1dhdGNoZXJzW3RoaXMuc2VsZWN0b3JdO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSBhKHRoaXMpLmRhdGEoXCJtYXNrXCIpO1xuICAgICAgICAgICAgICAgIGIgJiYgYi5yZW1vdmUoKS5yZW1vdmVEYXRhKFwibWFza1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBhLmZuLmNsZWFuVmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YShcIm1hc2tcIikuZ2V0Q2xlYW5WYWwoKTtcbiAgICAgICAgfTtcbiAgICAgICAgYS5hcHBseURhdGFNYXNrID0gZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgIGIgPSBiIHx8IGEuak1hc2tHbG9iYWxzLm1hc2tFbGVtZW50cztcbiAgICAgICAgICAgIChiIGluc3RhbmNlb2YgYSA/IGIgOiBhKGIpKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoYS5qTWFza0dsb2JhbHMuZGF0YU1hc2tBdHRyKVxuICAgICAgICAgICAgICAgIC5lYWNoKGYpO1xuICAgICAgICB9O1xuICAgICAgICBrID0ge1xuICAgICAgICAgICAgbWFza0VsZW1lbnRzOiBcImlucHV0LHRkLHNwYW4sZGl2XCIsXG4gICAgICAgICAgICBkYXRhTWFza0F0dHI6IFwiKltkYXRhLW1hc2tdXCIsXG4gICAgICAgICAgICBkYXRhTWFzazogITAsXG4gICAgICAgICAgICB3YXRjaEludGVydmFsOiAzMDAsXG4gICAgICAgICAgICB3YXRjaElucHV0czogITAsXG4gICAgICAgICAgICBrZXlTdHJva2VDb21wZW5zYXRpb246IDEwLFxuICAgICAgICAgICAgdXNlSW5wdXQ6XG4gICAgICAgICAgICAgICAgIS9DaHJvbWVcXC9bMi00XVswLTldfFNhbXN1bmdCcm93c2VyLy50ZXN0KFxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgICAgICAgICAgICAgICkgJiYgayhcImlucHV0XCIpLFxuICAgICAgICAgICAgd2F0Y2hEYXRhTWFzazogITEsXG4gICAgICAgICAgICBieVBhc3NLZXlzOiBbOSwgMTYsIDE3LCAxOCwgMzYsIDM3LCAzOCwgMzksIDQwLCA5MV0sXG4gICAgICAgICAgICB0cmFuc2xhdGlvbjoge1xuICAgICAgICAgICAgICAgIDA6IHsgcGF0dGVybjogL1xcZC8gfSxcbiAgICAgICAgICAgICAgICA5OiB7IHBhdHRlcm46IC9cXGQvLCBvcHRpb25hbDogITAgfSxcbiAgICAgICAgICAgICAgICBcIiNcIjogeyBwYXR0ZXJuOiAvXFxkLywgcmVjdXJzaXZlOiAhMCB9LFxuICAgICAgICAgICAgICAgIEE6IHsgcGF0dGVybjogL1thLXpBLVowLTldLyB9LFxuICAgICAgICAgICAgICAgIFM6IHsgcGF0dGVybjogL1thLXpBLVpdLyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgYS5qTWFza0dsb2JhbHMgPSBhLmpNYXNrR2xvYmFscyB8fCB7fTtcbiAgICAgICAgayA9IGEuak1hc2tHbG9iYWxzID0gYS5leHRlbmQoITAsIHt9LCBrLCBhLmpNYXNrR2xvYmFscyk7XG4gICAgICAgIGsuZGF0YU1hc2sgJiYgYS5hcHBseURhdGFNYXNrKCk7XG4gICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGEuak1hc2tHbG9iYWxzLndhdGNoRGF0YU1hc2sgJiYgYS5hcHBseURhdGFNYXNrKCk7XG4gICAgICAgIH0sIGsud2F0Y2hJbnRlcnZhbCk7XG4gICAgfSxcbiAgICB3aW5kb3cualF1ZXJ5LFxuICAgIHdpbmRvdy5aZXB0b1xuKTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZpY2VFeGVtcGxlIHtcbiAgICAvL2Vzc2UgZWggdW0gZXhlbXBsbyBkZSBzZXJ2aWNlXG4gICAgLy9lc3NhIHJvdGEsIGVoIHVtIGV4ZW1wbG8gZGUgcm90YSBkZWNsYXJhZGEgZGVudHJvIGRvIHNlcnZpY2Ugbm9kZVxuICAgIC8vb3Mgc2VydmljZXMgc2VydmVtIHBhcmEgY29uc3VtaXIgYXBpcyBlIGFwaXMgcHJpdmFkYXNcbiAgICBhc3luYyBnZXRBbGxJbmZvQ2xpZW50KGlkKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmZXRjaChcbiAgICAgICAgICAgIGAvY2xpZW50YXBpL2dldEluZm9DbGllbnQvJHtpZH1gLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGEuanNvbigpO1xuICAgIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGpRdWVyeTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcblx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIG1vZHVsZTsgfTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCJyZWdlbmVyYXRvci1ydW50aW1lXCI7XG5pbXBvcnQgRXhlbXBsZSBmcm9tIFwiLi9jb21wb25lbnRzL0V4ZW1wbGUuanNcIjtcbmltcG9ydCBcIi4vbGliL2pxdWVyeS5tYXNrLm1pbi5qc1wiO1xuXG5jbGFzcyBDaGVja291dCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIG5ldyBFeGVtcGxlKCk7XG4gICAgfVxufVxuXG5uZXcgQ2hlY2tvdXQoKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgIHNjcmlwdC5kZWZlciA9IHRydWU7XG4gICAgc2NyaXB0LnNyYyA9IFwiLy9zdWl0ZS5saW54aW1wdWxzZS5uZXQvaW1wdWxzZS9pbXB1bHNlLmpzXCI7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZShcImRhdGEtYXBpa2V5XCIsIFwicGFkb3ZhbmlcIik7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xufSkoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==