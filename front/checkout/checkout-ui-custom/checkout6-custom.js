/******/ (function () {
    // webpackBootstrap
    /******/ var __webpack_modules__ = {
        /***/ "./node_modules/regenerator-runtime/runtime.js":
            /*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
            /***/ function (module) {
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
                    var defineProperty =
                        Object.defineProperty ||
                        function (obj, key, desc) {
                            obj[key] = desc.value;
                        };
                    var undefined; // More compressible than void 0.
                    var $Symbol = typeof Symbol === "function" ? Symbol : {};
                    var iteratorSymbol = $Symbol.iterator || "@@iterator";
                    var asyncIteratorSymbol =
                        $Symbol.asyncIterator || "@@asyncIterator";
                    var toStringTagSymbol =
                        $Symbol.toStringTag || "@@toStringTag";

                    function define(obj, key, value) {
                        Object.defineProperty(obj, key, {
                            value: value,
                            enumerable: true,
                            configurable: true,
                            writable: true,
                        });
                        return obj[key];
                    }
                    try {
                        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
                        define({}, "");
                    } catch (err) {
                        define = function (obj, key, value) {
                            return (obj[key] = value);
                        };
                    }

                    function wrap(innerFn, outerFn, self, tryLocsList) {
                        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
                        var protoGenerator =
                            outerFn && outerFn.prototype instanceof Generator
                                ? outerFn
                                : Generator;
                        var generator = Object.create(protoGenerator.prototype);
                        var context = new Context(tryLocsList || []);

                        // The ._invoke method unifies the implementations of the .next,
                        // .throw, and .return methods.
                        defineProperty(generator, "_invoke", {
                            value: makeInvokeMethod(innerFn, self, context),
                        });

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
                    var NativeIteratorPrototype =
                        getProto && getProto(getProto(values([])));
                    if (
                        NativeIteratorPrototype &&
                        NativeIteratorPrototype !== Op &&
                        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
                    ) {
                        // This environment has a native %IteratorPrototype%; use it instead
                        // of the polyfill.
                        IteratorPrototype = NativeIteratorPrototype;
                    }

                    var Gp =
                        (GeneratorFunctionPrototype.prototype =
                        Generator.prototype =
                            Object.create(IteratorPrototype));
                    GeneratorFunction.prototype = GeneratorFunctionPrototype;
                    defineProperty(Gp, "constructor", {
                        value: GeneratorFunctionPrototype,
                        configurable: true,
                    });
                    defineProperty(GeneratorFunctionPrototype, "constructor", {
                        value: GeneratorFunction,
                        configurable: true,
                    });
                    GeneratorFunction.displayName = define(
                        GeneratorFunctionPrototype,
                        toStringTagSymbol,
                        "GeneratorFunction"
                    );

                    // Helper for defining the .next, .throw, and .return methods of the
                    // Iterator interface in terms of a single ._invoke method.
                    function defineIteratorMethods(prototype) {
                        ["next", "throw", "return"].forEach(function (method) {
                            define(prototype, method, function (arg) {
                                return this._invoke(method, arg);
                            });
                        });
                    }

                    exports.isGeneratorFunction = function (genFun) {
                        var ctor =
                            typeof genFun === "function" && genFun.constructor;
                        return ctor
                            ? ctor === GeneratorFunction ||
                                  // For the native GeneratorFunction constructor, the best we can
                                  // do is to check its .name property.
                                  (ctor.displayName || ctor.name) ===
                                      "GeneratorFunction"
                            : false;
                    };

                    exports.mark = function (genFun) {
                        if (Object.setPrototypeOf) {
                            Object.setPrototypeOf(
                                genFun,
                                GeneratorFunctionPrototype
                            );
                        } else {
                            genFun.__proto__ = GeneratorFunctionPrototype;
                            define(
                                genFun,
                                toStringTagSymbol,
                                "GeneratorFunction"
                            );
                        }
                        genFun.prototype = Object.create(Gp);
                        return genFun;
                    };

                    // Within the body of any async function, `await x` is transformed to
                    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
                    // `hasOwn.call(value, "__await")` to determine if the yielded value is
                    // meant to be awaited.
                    exports.awrap = function (arg) {
                        return { __await: arg };
                    };

                    function AsyncIterator(generator, PromiseImpl) {
                        function invoke(method, arg, resolve, reject) {
                            var record = tryCatch(
                                generator[method],
                                generator,
                                arg
                            );
                            if (record.type === "throw") {
                                reject(record.arg);
                            } else {
                                var result = record.arg;
                                var value = result.value;
                                if (
                                    value &&
                                    typeof value === "object" &&
                                    hasOwn.call(value, "__await")
                                ) {
                                    return PromiseImpl.resolve(
                                        value.__await
                                    ).then(
                                        function (value) {
                                            invoke(
                                                "next",
                                                value,
                                                resolve,
                                                reject
                                            );
                                        },
                                        function (err) {
                                            invoke(
                                                "throw",
                                                err,
                                                resolve,
                                                reject
                                            );
                                        }
                                    );
                                }

                                return PromiseImpl.resolve(value).then(
                                    function (unwrapped) {
                                        // When a yielded Promise is resolved, its final value becomes
                                        // the .value of the Promise<{value,done}> result for the
                                        // current iteration.
                                        result.value = unwrapped;
                                        resolve(result);
                                    },
                                    function (error) {
                                        // If a rejected Promise was yielded, throw the rejection back
                                        // into the async generator function so it can be handled there.
                                        return invoke(
                                            "throw",
                                            error,
                                            resolve,
                                            reject
                                        );
                                    }
                                );
                            }
                        }

                        var previousPromise;

                        function enqueue(method, arg) {
                            function callInvokeWithMethodAndArg() {
                                return new PromiseImpl(function (
                                    resolve,
                                    reject
                                ) {
                                    invoke(method, arg, resolve, reject);
                                });
                            }

                            return (previousPromise =
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
                                previousPromise
                                    ? previousPromise.then(
                                          callInvokeWithMethodAndArg,
                                          // Avoid propagating failures to Promises returned by later
                                          // invocations of the iterator.
                                          callInvokeWithMethodAndArg
                                      )
                                    : callInvokeWithMethodAndArg());
                        }

                        // Define the unified helper method that is used to implement .next,
                        // .throw, and .return (see defineIteratorMethods).
                        defineProperty(this, "_invoke", { value: enqueue });
                    }

                    defineIteratorMethods(AsyncIterator.prototype);
                    define(
                        AsyncIterator.prototype,
                        asyncIteratorSymbol,
                        function () {
                            return this;
                        }
                    );
                    exports.AsyncIterator = AsyncIterator;

                    // Note that simple async functions are implemented on top of
                    // AsyncIterator objects; they just return a Promise for the value of
                    // the final result produced by the iterator.
                    exports.async = function (
                        innerFn,
                        outerFn,
                        self,
                        tryLocsList,
                        PromiseImpl
                    ) {
                        if (PromiseImpl === void 0) PromiseImpl = Promise;

                        var iter = new AsyncIterator(
                            wrap(innerFn, outerFn, self, tryLocsList),
                            PromiseImpl
                        );

                        return exports.isGeneratorFunction(outerFn)
                            ? iter // If outerFn is a generator, return the full iterator.
                            : iter.next().then(function (result) {
                                  return result.done
                                      ? result.value
                                      : iter.next();
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
                                    var delegateResult = maybeInvokeDelegate(
                                        delegate,
                                        context
                                    );
                                    if (delegateResult) {
                                        if (delegateResult === ContinueSentinel)
                                            continue;
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
                                        done: context.done,
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
                            if (
                                methodName === "throw" &&
                                delegate.iterator["return"]
                            ) {
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
                                    "The iterator does not provide a '" +
                                        methodName +
                                        "' method"
                                );
                            }

                            return ContinueSentinel;
                        }

                        var record = tryCatch(
                            method,
                            delegate.iterator,
                            context.arg
                        );

                        if (record.type === "throw") {
                            context.method = "throw";
                            context.arg = record.arg;
                            context.delegate = null;
                            return ContinueSentinel;
                        }

                        var info = record.arg;

                        if (!info) {
                            context.method = "throw";
                            context.arg = new TypeError(
                                "iterator result is not an object"
                            );
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
                    define(Gp, iteratorSymbol, function () {
                        return this;
                    });

                    define(Gp, "toString", function () {
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

                    exports.keys = function (val) {
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
                                var i = -1,
                                    next = function next() {
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

                                return (next.next = next);
                            }
                        }

                        throw new TypeError(
                            typeof iterable + " is not iterable"
                        );
                    }
                    exports.values = values;

                    function doneResult() {
                        return { value: undefined, done: true };
                    }

                    Context.prototype = {
                        constructor: Context,

                        reset: function (skipTempReset) {
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
                                    if (
                                        name.charAt(0) === "t" &&
                                        hasOwn.call(this, name) &&
                                        !isNaN(+name.slice(1))
                                    ) {
                                        this[name] = undefined;
                                    }
                                }
                            }
                        },

                        stop: function () {
                            this.done = true;

                            var rootEntry = this.tryEntries[0];
                            var rootRecord = rootEntry.completion;
                            if (rootRecord.type === "throw") {
                                throw rootRecord.arg;
                            }

                            return this.rval;
                        },

                        dispatchException: function (exception) {
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

                                return !!caught;
                            }

                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                var record = entry.completion;

                                if (entry.tryLoc === "root") {
                                    // Exception thrown outside of any try block that could handle
                                    // it, so set the completion value of the entire function to
                                    // throw the exception.
                                    return handle("end");
                                }

                                if (entry.tryLoc <= this.prev) {
                                    var hasCatch = hasOwn.call(
                                        entry,
                                        "catchLoc"
                                    );
                                    var hasFinally = hasOwn.call(
                                        entry,
                                        "finallyLoc"
                                    );

                                    if (hasCatch && hasFinally) {
                                        if (this.prev < entry.catchLoc) {
                                            return handle(entry.catchLoc, true);
                                        } else if (
                                            this.prev < entry.finallyLoc
                                        ) {
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
                                        throw new Error(
                                            "try statement without catch or finally"
                                        );
                                    }
                                }
                            }
                        },

                        abrupt: function (type, arg) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                if (
                                    entry.tryLoc <= this.prev &&
                                    hasOwn.call(entry, "finallyLoc") &&
                                    this.prev < entry.finallyLoc
                                ) {
                                    var finallyEntry = entry;
                                    break;
                                }
                            }

                            if (
                                finallyEntry &&
                                (type === "break" || type === "continue") &&
                                finallyEntry.tryLoc <= arg &&
                                arg <= finallyEntry.finallyLoc
                            ) {
                                // Ignore the finally entry if control is not jumping to a
                                // location outside the try/catch block.
                                finallyEntry = null;
                            }

                            var record = finallyEntry
                                ? finallyEntry.completion
                                : {};
                            record.type = type;
                            record.arg = arg;

                            if (finallyEntry) {
                                this.method = "next";
                                this.next = finallyEntry.finallyLoc;
                                return ContinueSentinel;
                            }

                            return this.complete(record);
                        },

                        complete: function (record, afterLoc) {
                            if (record.type === "throw") {
                                throw record.arg;
                            }

                            if (
                                record.type === "break" ||
                                record.type === "continue"
                            ) {
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

                        finish: function (finallyLoc) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                if (entry.finallyLoc === finallyLoc) {
                                    this.complete(
                                        entry.completion,
                                        entry.afterLoc
                                    );
                                    resetTryEntry(entry);
                                    return ContinueSentinel;
                                }
                            }
                        },

                        catch: function (tryLoc) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
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

                        delegateYield: function (
                            iterable,
                            resultName,
                            nextLoc
                        ) {
                            this.delegate = {
                                iterator: values(iterable),
                                resultName: resultName,
                                nextLoc: nextLoc,
                            };

                            if (this.method === "next") {
                                // Deliberately forget the last sent value so that we don't
                                // accidentally pass it on to the delegate.
                                this.arg = undefined;
                            }

                            return ContinueSentinel;
                        },
                    };

                    // Regardless of whether this script is executing as a CommonJS module
                    // or not, return the runtime object so that we can declare the variable
                    // regeneratorRuntime in the outer scope, which allows this module to be
                    // injected easily by `bin/regenerator --include-runtime script.js`.
                    return exports;
                })(
                    // If this script is executing as a CommonJS module, use module.exports
                    // as the regeneratorRuntime namespace. Otherwise create a new empty
                    // object. Either way, the resulting object will be used to initialize
                    // the regeneratorRuntime variable at the top of this file.
                    true ? module.exports : 0
                );

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

                /***/
            },

        /***/ "./src/arquivos/js/components/CodeSeller.js":
            /*!**************************************************!*\
  !*** ./src/arquivos/js/components/CodeSeller.js ***!
  \**************************************************/
            /***/ function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(
                    __webpack_exports__,
                    {
                        /* harmony export */ default: function () {
                            return /* binding */ CodeSeller;
                        },
                        /* harmony export */
                    }
                );
                /* provided dependency */ var $ = __webpack_require__(
                    /*! jquery */ "jquery"
                );
                class CodeSeller {
                    constructor() {
                        this.idDocument = "";
                        this.debounceTimer = null;
                        this.hasVendorDisplayed = false; // Flag para garantir que o vendedor seja exibido uma vez
                        this.init();
                    }

                    init() {
                        this.validationContentMarketingData();
                        this.loadSavedCoupon();
                        this.handleCoupon();
                        this.handleInputChange();

                        setInterval(() => {
                            const button = $("button#salesmancode-remove");

                            if (!button.hasClass("active")) {
                                this.removeCoupon();
                            }
                        }, 1000);
                    }

                    validationContentMarketingData() {
                        fetch(`/api/checkout/pub/orderForm`)
                            .then((res) => res.json())
                            .then((orderForm) => {
                                if (orderForm.marketingData?.utmiCampaign) {
                                    if (!this.hasVendorDisplayed) {
                                        this.resultVendorData(
                                            orderForm.marketingData.utmiCampaign
                                        );
                                    }
                                } else {
                                    this.addInput();
                                }
                            });
                    }

                    resultVendorData(cod) {
                        const _this = this;

                        $.ajax({
                            method: "GET",
                            url: `/customrequest/getvendorcode/${cod}`,
                            success: function (response) {
                                if (response.length > 0) {
                                    _this.showVendorInfo(response[0]);
                                } else {
                                    $(".salesman-result").html(
                                        '<div class="error">Código de Vendedor inválido!</div>'
                                    );
                                }
                            },
                            error: function (erro) {
                                console.error(erro);
                                $(".salesman-result").html(
                                    '<div class="error">Erro na busca do código do vendedor</div>'
                                );
                            },
                        });
                    }

                    showVendorInfo(vendorData) {
                        // Verifica se já foi exibido para evitar repetição
                        $(".salesman-resultt").remove();

                        let html = `
            <div class="salesman-resultt">
                <div class="show-salesmancode">Vendedor: ${vendorData.codigovendedor} - ${vendorData.nome}</div>
                <button id="salesmancode-remove" class="cart-salesmancode-remove">Remover</button>
            </div>
        `;

                        this.waitForEl(
                            ".forms.coupon-column.summary-coupon-wrap"
                        ).then(() => {
                            $(
                                ".forms.coupon-column.summary-coupon-wrap"
                            ).prepend(html);
                            this.hasVendorDisplayed = true;
                            this.removeCoupon();
                            this.loadSavedCoupon();
                        });

                        vtexjs.checkout.setCustomData({
                            app: "codigovendedor",
                            field: "codigoVendedor",
                            value: `${vendorData.codigovendedor}`,
                        });

                        vtexjs.checkout
                            .getOrderForm()
                            .then(function (orderForm) {
                                const marketingData = orderForm.marketingData;
                                marketingData.utmiCampaign = `${vendorData.codigovendedor}`;

                                return vtexjs.checkout.sendAttachment(
                                    "marketingData",
                                    marketingData
                                );
                            });
                        this.removeCoupon();
                    }

                    addInput() {
                        const _this = this;

                        if ($(".salesman-coupon").length === 0) {
                            let html = `
        <div class="salesman-coupon new-code-salesman">
          <span class="title-salesman-coupon">Código do Vendedor</span>
          <form class="salesman-coupon-form">
            <input type="text" placeholder="Escreva o Código do Vendedor" name="codigovendedor" id="codigovendedor" />
            <button type="submit" class="coupon-send">Aplicar</button>
          </form>
          <div class="salesman-result"></div>
        </div>
      `;

                            _this
                                .waitForEl(
                                    ".forms.coupon-column.summary-coupon-wrap"
                                )
                                .then(() => {
                                    $(
                                        ".forms.coupon-column.summary-coupon-wrap"
                                    ).prepend(html);
                                    _this.loadSavedCoupon();
                                });
                        }
                    }

                    handleInputChange() {
                        const _this = this;

                        $(document).on("input", "#codigovendedor", function () {
                            const inputValue = $(this).val();

                            if (_this.debounceTimer) {
                                clearTimeout(_this.debounceTimer);
                            }

                            _this.debounceTimer = setTimeout(() => {
                                if (inputValue) {
                                    _this.fetchVendorData(inputValue);
                                } else {
                                    $(".salesman-result").html("");
                                }
                            }, 500);
                        });
                    }

                    fetchVendorData(cod) {
                        const _this = this;

                        $.ajax({
                            method: "GET",
                            url: `/customrequest/getvendorcode/${cod}`,
                            success: function (response) {
                                if (response.length > 0) {
                                    _this.showVendorData(response[0]);
                                } else {
                                    $(".salesman-result").html(
                                        '<div class="error">Código de Vendedor inválido!</div>'
                                    );
                                }
                            },
                            error: function (erro) {
                                console.error(erro);
                                $(".salesman-result").html(
                                    '<div class="error">Erro na busca do código do vendedor</div>'
                                );
                            },
                        });
                    }

                    showVendorData(vendorData) {
                        const html = `
        <div class="show-salesmancode">
            Vendedor: ${vendorData.codigovendedor} - ${vendorData.nome}
        </div>
        `;
                        $(".salesman-result").html(html);
                    }

                    handleCoupon() {
                        const _this = this;

                        $(document).on(
                            "submit",
                            "form.salesman-coupon-form",
                            function (e) {
                                e.preventDefault();

                                let cod = $(this).find("#codigovendedor").val();

                                $.ajax({
                                    method: "GET",
                                    url: `/customrequest/getvendorcode/${cod}`,
                                    success: function (response) {
                                        if (response.length > 0) {
                                            _this.idDocument = response[0].id;
                                            _this.infoVendedor(
                                                _this.idDocument
                                            );
                                            $(".salesman-coupon-form").hide();
                                            $(".title-salesman-coupon").hide();
                                        } else {
                                            alert(
                                                "Código de Vendedor inválido! Tente outro código"
                                            );
                                        }
                                    },
                                    error: function (erro) {
                                        console.error(erro);
                                    },
                                });
                            }
                        );
                    }

                    infoVendedor(idDocument) {
                        const _this = this;

                        $.ajax({
                            method: "GET",
                            url: `/customrequest/getvendordata/${idDocument}`,
                            success: function (response) {
                                if (response.status) {
                                    _this.contentValidCoupon(response);
                                    _this.saveCouponToLocalStorage(response);
                                } else {
                                    alert(
                                        "Código de Vendedor inválido! Tente outro código"
                                    );
                                }
                            },
                            error: function (erro) {
                                console.error(erro);
                            },
                        });
                    }

                    contentValidCoupon(content) {
                        if (!window.vtexjs) {
                            return;
                        }

                        const _this = this;

                        const html = `
            <div class="show-salesmancode">
                Vendedor: ${content.codigovendedor} - ${content.nome}
            </div>
            <button id="salesmancode-remove" class="cart-salesmancode-remove">
                Remover
            </button>
        `;

                        $(".salesman-result").html(html);

                        vtexjs?.checkout?.setCustomData({
                            app: "codigovendedor",
                            field: "codigoVendedor",
                            value: `${content.codigovendedor}`,
                        });

                        vtexjs.checkout
                            .getOrderForm()
                            .then(function (orderForm) {
                                const marketingData = orderForm.marketingData;
                                marketingData.utmiCampaign = `${content.codigovendedor}`;

                                return vtexjs.checkout.sendAttachment(
                                    "marketingData",
                                    marketingData
                                );
                            });

                        _this.removeCoupon();
                    }

                    removeCoupon() {
                        $("button#salesmancode-remove").addClass("active");

                        $("button#salesmancode-remove").on("click", () => {
                            $(
                                ".show-salesmancode, .cart-salesmancode-remove"
                            ).hide();
                            $(".salesman-coupon-form").show();
                            $(".title-salesman-coupon").show();

                            localStorage.removeItem("salesmanData");

                            const options = {
                                method: "DELETE",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                            };

                            fetch(
                                `/api/checkout/pub/orderForm/${vtexjs?.checkout?.orderFormId}/customData/codigovendedor/codigoVendedor`,
                                options
                            )
                                .then((response) => response.json())
                                .then((response) => {})
                                .catch((error) => {
                                    console.error(
                                        "Erro ao remover customData:",
                                        error
                                    );
                                });

                            vtexjs.checkout
                                .getOrderForm()
                                .then(function (orderForm) {
                                    const marketingData =
                                        orderForm.marketingData;
                                    marketingData.utmiCampaign = null;

                                    return vtexjs.checkout.sendAttachment(
                                        "marketingData",
                                        marketingData
                                    );
                                });

                            this.addInput();
                        });
                    }

                    saveCouponToLocalStorage(content) {
                        const salesmanData = {
                            codigovendedor: content.codigovendedor,
                            nome: content.nome,
                        };
                        localStorage.setItem(
                            "salesmanData",
                            JSON.stringify(salesmanData)
                        );
                    }

                    loadSavedCoupon() {
                        if (!window.vtexjs) {
                            return;
                        }

                        const _this = this;

                        const savedData = localStorage.getItem("salesmanData");

                        if (savedData) {
                            const content = JSON.parse(savedData);

                            const html = `
                <div class="show-salesmancode">
                    Vendedor: ${content.codigovendedor} - ${content.nome}
                </div>
                <button id="salesmancode-remove" class="cart-salesmancode-remove">
                    Remover
                </button>`;

                            $(".salesman-result").html(html);
                            $(".salesman-coupon-form").hide();
                        }
                    }

                    waitForEl(selector) {
                        return new Promise((resolve) => {
                            if ($(selector).length) {
                                resolve($(selector));
                            }

                            const observer = new MutationObserver(() => {
                                if ($(selector).length) {
                                    resolve($(selector));
                                    observer.disconnect();
                                }
                            });

                            observer.observe(document.body, {
                                childList: true,
                                subtree: true,
                            });
                        });
                    }
                }

                /***/
            },

        /***/ "./src/arquivos/js/components/Exemple.js":
            /*!***********************************************!*\
  !*** ./src/arquivos/js/components/Exemple.js ***!
  \***********************************************/
            /***/ function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(
                    __webpack_exports__,
                    {
                        /* harmony export */ default: function () {
                            return /* binding */ Exemple;
                        },
                        /* harmony export */
                    }
                );
                /* harmony import */ var _helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__ =
                    __webpack_require__(
                        /*! ../helpers/waitForEl */ "./src/arquivos/js/helpers/waitForEl.js"
                    );
                /* harmony import */ var _services_ServiceExemple__WEBPACK_IMPORTED_MODULE_1__ =
                    __webpack_require__(
                        /*! ../services/ServiceExemple */ "./src/arquivos/js/services/ServiceExemple.js"
                    );
                /* provided dependency */ var $ = __webpack_require__(
                    /*! jquery */ "jquery"
                );

                class Exemple {
                    serviceExemple =
                        new _services_ServiceExemple__WEBPACK_IMPORTED_MODULE_1__[
                            "default"
                        ]();

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
                                (0,
                                _helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__[
                                    "default"
                                ])("#ship-complement")
                                    .then
                                    //develop
                                    ();
                            }
                        });

                        window.addEventListener("load", () => {
                            if (window.location.hash != "#/cart") {
                                (0,
                                _helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__[
                                    "default"
                                ])(
                                    ".summary-cart-template-holder .hproduct .photo"
                                )
                                    .then
                                    //develop
                                    ();
                            }
                        });

                        $(window).on("orderFormUpdated.vtex", function () {
                            const orderFormData = vtexjs.checkout.orderForm;
                            let postalCode = null;

                            if (
                                orderFormData.shippingData &&
                                orderFormData.shippingData.address &&
                                orderFormData.shippingData.address.postalCode
                            ) {
                                postalCode =
                                    orderFormData.shippingData.address
                                        .postalCode;
                            } else if (
                                orderFormData.shippingData &&
                                orderFormData.shippingData.availableAddresses
                                    .length > 0
                            ) {
                                postalCode =
                                    orderFormData.shippingData
                                        .availableAddresses[0].postalCode; // Assume que o primeiro endereço disponível é o principal
                            }

                            if (!postalCode) {
                                console.error(
                                    "Postal Code não disponível. Requisição não será feita."
                                );
                                return;
                            }

                            orderFormData.items.forEach((item) => {
                                const itemData = {
                                    id: item.id,
                                    quantity: item.quantity,
                                    seller: "1",
                                };

                                fetch(
                                    "/api/checkout/pub/orderForms/simulation?RnbBehavior=0&sc=1&individualShippingEstimates=true",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Accept: "application/json",
                                        },
                                        body: JSON.stringify({
                                            items: [itemData],
                                            postalCode: postalCode,
                                            country: "BRA",
                                            expectedOrderFormSections: [
                                                "items",
                                                "totalizers",
                                                "shipping",
                                            ],
                                        }),
                                    }
                                )
                                    .then((response) => response.json())
                                    .then((dataResponse) => {
                                        if (
                                            dataResponse.logisticsInfo &&
                                            dataResponse.logisticsInfo.length >
                                                0
                                        ) {
                                            const shippingEstimates =
                                                dataResponse.logisticsInfo
                                                    .map((logistics) => {
                                                        let sla =
                                                            logistics.slas.find(
                                                                (sla) =>
                                                                    sla.id ===
                                                                    "SEDEX"
                                                            );

                                                        if (!sla) {
                                                            sla =
                                                                logistics.slas.find(
                                                                    (sla) =>
                                                                        sla.id ===
                                                                        "Normal"
                                                                );
                                                        }

                                                        return sla
                                                            ? sla.shippingEstimate
                                                            : null;
                                                    })
                                                    .filter(Boolean);

                                            if (shippingEstimates.length > 0) {
                                                let shippingEstimate =
                                                    shippingEstimates[0];
                                                shippingEstimate =
                                                    shippingEstimate.match(
                                                        /\d+/
                                                    )[0];

                                                if (
                                                    !$(
                                                        `.product-item[data-sku=${item.id}] .shipping-date .shipping-estimate-date`
                                                    ).find(
                                                        `.custom-message-${item.id}`
                                                    ).length
                                                ) {
                                                    const shippingMessage = `
                                    <p class='custom-message-info custom-message-${item.id}'>
                                        Em até ${shippingEstimate} dias úteis
                                    </p>
                                `;

                                                    $(
                                                        `.product-item[data-sku=${item.id}] .shipping-date .shipping-estimate-date`
                                                    ).append(shippingMessage);
                                                }
                                            } else {
                                                console.error(
                                                    `Nenhum SLA com id 'SEDEX' encontrado para o item ${item.id}.`
                                                );
                                            }
                                        } else {
                                            console.error(
                                                `Nenhuma informação de logisticsInfo encontrada para o item ${item.id}.`
                                            );
                                        }

                                        const slaElements = $(
                                            ".srp-shipping-current-single__sla.gray"
                                        );

                                        (0,
                                        _helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__[
                                            "default"
                                        ])(slaElements).then(() => {
                                            slaElements.each(function () {
                                                const slaText = $(this)
                                                    .text()
                                                    .trim();

                                                if (
                                                    slaText.includes(
                                                        "Pronto em até"
                                                    )
                                                ) {
                                                    $(
                                                        ".custom-message-info"
                                                    ).hide();

                                                    const shippingEstimateDateElement =
                                                        $(
                                                            ".shipping-estimate-date"
                                                        );

                                                    if (
                                                        shippingEstimateDateElement.length
                                                    ) {
                                                        shippingEstimateDateElement.addClass(
                                                            "active"
                                                        );
                                                    }
                                                }
                                            });
                                        });
                                    })
                                    .catch((error) => {
                                        console.error(
                                            `Erro para o item ${item.id}:`,
                                            error
                                        );
                                    });
                            });
                        });

                        $(window).on("orderFormUpdated.vtex", () => {
                            if (window.location.hash != "#/cart") {
                                (0,
                                _helpers_waitForEl__WEBPACK_IMPORTED_MODULE_0__[
                                    "default"
                                ])(".hproduct .photo").then(() => {
                                    this.exempleMethod();
                                });
                            }
                        });
                    }

                    exempleMethod() {
                        this.title.addClass("teste");
                        this.serviceExemple.getAllInfoClient(1);
                    }
                }

                /***/
            },

        /***/ "./src/arquivos/js/components/priceMeterPromotion.js":
            /*!***********************************************************!*\
  !*** ./src/arquivos/js/components/priceMeterPromotion.js ***!
  \***********************************************************/
            /***/ function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(
                    __webpack_exports__,
                    {
                        /* harmony export */ default: function () {
                            return /* binding */ priceMeterPromotion;
                        },
                        /* harmony export */
                    }
                );
                /* provided dependency */ var $ = __webpack_require__(
                    /*! jquery */ "jquery"
                );
                class priceMeterPromotion {
                    constructor() {
                        this.init();
                    }

                    init() {
                        window.addEventListener("DOMContentLoaded", () => {
                            $(window).on("orderFormUpdated.vtex", () => {
                                this.validationPriceMeterPromotion();
                            });

                            $(window).on("hashchange", () => {
                                this.validationPriceMeterPromotion();
                            });
                        });
                    }

                    validationPriceMeterPromotion() {
                        this.waitForEl(".new-product-real-price-per-unit")
                            .then(() => {
                                this.createPriceMeterPromotion();
                            })
                            .catch((error) => {
                                console.error(
                                    "Erro ao esperar pelo elemento:",
                                    error
                                );
                            });
                    }

                    createPriceMeterPromotion() {
                        const orderForm = vtexjs.checkout.orderForm;

                        const discountData =
                            orderForm.ratesAndBenefitsData.rateAndBenefitsIdentifiers.find(
                                (identifier) => {
                                    return (
                                        identifier.name &&
                                        /\d+%/.test(identifier.name)
                                    ); // Identifica descontos por porcentagem
                                }
                            );

                        if (!discountData) {
                            console.warn(
                                "Nenhum cupom com desconto foi encontrado no orderForm."
                            );
                            return;
                        }

                        const discountMatch = discountData.name.match(/(\d+)%/);
                        const discountPercentage = discountMatch
                            ? parseInt(discountMatch[1], 10)
                            : 0;

                        if (discountPercentage > 0) {
                            orderForm.items.forEach((item, index) => {
                                const originalPricePerM2 = item.price / 100;
                                const discountedPricePerM2 =
                                    originalPricePerM2 *
                                    (1 - discountPercentage / 100);

                                const formattedPrice = discountedPricePerM2
                                    .toFixed(2)
                                    .replace(".", ",");

                                const productContainer =
                                    $(`.product-item`).eq(index);

                                if (productContainer.length > 0) {
                                    const originalPriceElement =
                                        productContainer
                                            .find(
                                                ".new-product-real-price-per-unit"
                                            )
                                            .not(".discounted");
                                    const originalPriceText =
                                        originalPriceElement.text().trim();

                                    if (
                                        !originalPriceText ||
                                        isNaN(
                                            parseFloat(
                                                originalPriceText
                                                    .replace("R$", "")
                                                    .replace(",", ".")
                                            )
                                        )
                                    ) {
                                        console.warn(
                                            `Produto "${item.name}" não possui um preço válido por m². Ignorando.`
                                        );
                                        return;
                                    }

                                    if (
                                        productContainer.attr(
                                            "data-discount-applied"
                                        ) === "true"
                                    ) {
                                        return;
                                    }

                                    productContainer
                                        .find(
                                            ".new-product-real-price-per-unit.discounted"
                                        )
                                        .remove();

                                    const newPriceElement = $("<small>", {
                                        class: "new-product-real-price-per-unit discounted",
                                        text: `R$ ${formattedPrice} / m²`,
                                    });

                                    originalPriceElement.hide();

                                    productContainer
                                        .find(".product-price")
                                        .append(newPriceElement);

                                    productContainer.attr(
                                        "data-discount-applied",
                                        "true"
                                    );
                                } else {
                                    console.warn(
                                        `Produto "${item.name}" não encontrado no DOM.`
                                    );
                                }
                            });
                        } else {
                            console.warn(
                                "Nenhum desconto percentual válido foi identificado."
                            );
                        }
                    }

                    waitForEl(selector) {
                        return new Promise((resolve) => {
                            if ($(selector).length) {
                                resolve($(selector));
                            }

                            const observer = new MutationObserver(() => {
                                if ($(selector).length) {
                                    resolve($(selector));
                                    observer.disconnect();
                                }
                            });

                            observer.observe(document.body, {
                                childList: true,
                                subtree: true,
                            });
                        });
                    }
                }

                /***/
            },

        /***/ "./src/arquivos/js/helpers/waitForEl.js":
            /*!**********************************************!*\
  !*** ./src/arquivos/js/helpers/waitForEl.js ***!
  \**********************************************/
            /***/ function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(
                    __webpack_exports__,
                    {
                        /* harmony export */ default: function () {
                            return /* binding */ waitForEl;
                        },
                        /* harmony export */
                    }
                );
                /* provided dependency */ var jQuery = __webpack_require__(
                    /*! jquery */ "jquery"
                );
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

                /***/
            },

        /***/ "./src/arquivos/js/lib/jquery.mask.min.js":
            /*!************************************************!*\
  !*** ./src/arquivos/js/lib/jquery.mask.min.js ***!
  \************************************************/
            /***/ function (module, exports, __webpack_require__) {
                var __WEBPACK_AMD_DEFINE_FACTORY__,
                    __WEBPACK_AMD_DEFINE_ARRAY__,
                    __WEBPACK_AMD_DEFINE_RESULT__; /* eslint-disable no-useless-escape */
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
                    $jscomp.ASSUME_ES5 ||
                    "function" == typeof Object.defineProperties
                        ? Object.defineProperty
                        : function (a, n, f) {
                              a != Array.prototype &&
                                  a != Object.prototype &&
                                  (a[n] = f.value);
                          };
                $jscomp.getGlobal = function (a) {
                    return "undefined" != typeof window && window === a
                        ? a
                        : "undefined" != typeof __webpack_require__.g &&
                          null != __webpack_require__.g
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
                        ? !((__WEBPACK_AMD_DEFINE_ARRAY__ = [
                              __webpack_require__(/*! jquery */ "jquery"),
                          ]),
                          (__WEBPACK_AMD_DEFINE_FACTORY__ = a),
                          (__WEBPACK_AMD_DEFINE_RESULT__ =
                              typeof __WEBPACK_AMD_DEFINE_FACTORY__ ===
                              "function"
                                  ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(
                                        exports,
                                        __WEBPACK_AMD_DEFINE_ARRAY__
                                    )
                                  : __WEBPACK_AMD_DEFINE_FACTORY__),
                          __WEBPACK_AMD_DEFINE_RESULT__ !== undefined &&
                              (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
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
                                            -1 ===
                                                navigator.appVersion.indexOf(
                                                    "MSIE 10"
                                                )
                                        ) {
                                            var e = h.createRange();
                                            e.moveStart(
                                                "character",
                                                -c.val().length
                                            );
                                            a = e.text.length;
                                        } else if (d || "0" === d) a = d;
                                        return a;
                                    } catch (C) {}
                                },
                                setCaret: function (a) {
                                    try {
                                        if (b.is(":focus")) {
                                            var c = b.get(0);
                                            if (c.setSelectionRange)
                                                c.setSelectionRange(a, a);
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
                                        b.data(
                                            "mask-keycode",
                                            a.keyCode || a.which
                                        );
                                        b.data("mask-previus-value", b.val());
                                        b.data(
                                            "mask-previus-caret-pos",
                                            c.getCaret()
                                        );
                                        c.maskDigitPosMapOld =
                                            c.maskDigitPosMap;
                                    })
                                        .on(
                                            a.jMaskGlobals.useInput
                                                ? "input.mask"
                                                : "keyup.mask",
                                            c.behaviour
                                        )
                                        .on(
                                            "paste.mask drop.mask",
                                            function () {
                                                setTimeout(function () {
                                                    b.keydown().keyup();
                                                }, 100);
                                            }
                                        )
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
                                            !0 === e.selectOnFocus &&
                                                a(b.target).select();
                                        })
                                        .on("focusout.mask", function () {
                                            e.clearIfNotMatch &&
                                                !k.test(c.val()) &&
                                                c.val("");
                                        });
                                },
                                getRegexMask: function () {
                                    for (
                                        var a = [], b, c, e, t, f = 0;
                                        f < d.length;
                                        f++
                                    )
                                        (b = l.translation[d.charAt(f)])
                                            ? ((c = b.pattern
                                                  .toString()
                                                  .replace(/.{1}$|^.{1}/g, "")),
                                              (e = b.optional),
                                              (b = b.recursive)
                                                  ? (a.push(d.charAt(f)),
                                                    (t = {
                                                        digit: d.charAt(f),
                                                        pattern: c,
                                                    }))
                                                  : a.push(
                                                        e || b ? c + "?" : c
                                                    ))
                                            : a.push(
                                                  d
                                                      .charAt(f)
                                                      .replace(
                                                          /[-\/\\^$*+?.()|[\]{}]/g,
                                                          "\\$&"
                                                      )
                                              );
                                    a = a.join("");
                                    t &&
                                        (a = a
                                            .replace(
                                                new RegExp(
                                                    "(" +
                                                        t.digit +
                                                        "(.*" +
                                                        t.digit +
                                                        ")?)"
                                                ),
                                                "($1)?"
                                            )
                                            .replace(
                                                new RegExp(t.digit, "g"),
                                                t.pattern
                                            ));
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
                                        var e =
                                            b.data("mask-previus-caret-pos") ||
                                            0;
                                        d = d.length;
                                        var g = a.length,
                                            f = (a = 0),
                                            l = 0,
                                            k = 0,
                                            m;
                                        for (
                                            m = h;
                                            m < d && c.maskDigitPosMap[m];
                                            m++
                                        )
                                            f++;
                                        for (
                                            m = h - 1;
                                            0 <= m && c.maskDigitPosMap[m];
                                            m--
                                        )
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
                                            g =
                                                b.data("mask-previus-value") ||
                                                "";
                                        setTimeout(function () {
                                            c.setCaret(
                                                c.calculateCaretPosition(g)
                                            );
                                        }, a
                                            .jMaskGlobals.keyStrokeCompensation);
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
                                                          : g === x &&
                                                            g !== u &&
                                                            (g = u - m),
                                                      x === u && (g -= m)),
                                                  (g += m))
                                                : v === z
                                                ? (w--, (z = void 0))
                                                : q.optional
                                                ? ((g += m), (n -= m))
                                                : q.fallback
                                                ? (h[r](q.fallback),
                                                  (g += m),
                                                  (n -= m))
                                                : c.invalid.push({
                                                      p: n,
                                                      v: v,
                                                      e: q.pattern,
                                                  }),
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
                                    k !== p + 1 ||
                                        l.translation[a] ||
                                        h.push(a);
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
                            d =
                                "function" === typeof d
                                    ? d(c.val(), void 0, b, e)
                                    : d;
                            l.mask = d;
                            l.options = e;
                            l.remove = function () {
                                var a = c.getCaret();
                                l.options.placeholder &&
                                    b.removeAttr("placeholder");
                                b.data("mask-maxlength") &&
                                    b.removeAttr("maxlength");
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
                                l.clearIfNotMatch =
                                    a.jMaskGlobals.clearIfNotMatch;
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
                                    e.placeholder &&
                                        b.attr("placeholder", e.placeholder);
                                    b.data("mask") &&
                                        b.attr("autocomplete", "off");
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
                                b.attr("data-mask-clearifnotmatch") &&
                                    (d.clearIfNotMatch = !0);
                                "true" === b.attr("data-mask-selectonfocus") &&
                                    (d.selectOnFocus = !0);
                                if (p(b, e, d))
                                    return b.data("mask", new n(this, e, d));
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
                                    return a(this).data(
                                        "mask",
                                        new n(this, b, d)
                                    );
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
                        k = a.jMaskGlobals = a.extend(
                            !0,
                            {},
                            k,
                            a.jMaskGlobals
                        );
                        k.dataMask && a.applyDataMask();
                        setInterval(function () {
                            a.jMaskGlobals.watchDataMask && a.applyDataMask();
                        }, k.watchInterval);
                    },
                    window.jQuery,
                    window.Zepto
                );

                /***/
            },

        /***/ "./src/arquivos/js/services/ServiceExemple.js":
            /*!****************************************************!*\
  !*** ./src/arquivos/js/services/ServiceExemple.js ***!
  \****************************************************/
            /***/ function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(
                    __webpack_exports__,
                    {
                        /* harmony export */ default: function () {
                            return /* binding */ ServiceExemple;
                        },
                        /* harmony export */
                    }
                );
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

                /***/
            },

        /***/ jquery:
            /*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
            /***/ function (module) {
                "use strict";
                module.exports = jQuery;

                /***/
            },

        /******/
    };
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/ var cachedModule = __webpack_module_cache__[moduleId];
        /******/ if (cachedModule !== undefined) {
            /******/ return cachedModule.exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/ var module = (__webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/ exports: {},
            /******/
        });
        /******/
        /******/ // Execute the module function
        /******/ __webpack_modules__[moduleId].call(
            module.exports,
            module,
            module.exports,
            __webpack_require__
        );
        /******/
        /******/ // Return the exports of the module
        /******/ return module.exports;
        /******/
    }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */
    /******/ !(function () {
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = function (module) {
            /******/ var getter =
                module && module.__esModule
                    ? /******/ function () {
                          return module["default"];
                      }
                    : /******/ function () {
                          return module;
                      };
            /******/ __webpack_require__.d(getter, { a: getter });
            /******/ return getter;
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/define property getters */
    /******/ !(function () {
        /******/ // define getter functions for harmony exports
        /******/ __webpack_require__.d = function (exports, definition) {
            /******/ for (var key in definition) {
                /******/ if (
                    __webpack_require__.o(definition, key) &&
                    !__webpack_require__.o(exports, key)
                ) {
                    /******/ Object.defineProperty(exports, key, {
                        enumerable: true,
                        get: definition[key],
                    });
                    /******/
                }
                /******/
            }
            /******/
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/global */
    /******/ !(function () {
        /******/ __webpack_require__.g = (function () {
            /******/ if (typeof globalThis === "object") return globalThis;
            /******/ try {
                /******/ return this || new Function("return this")();
                /******/
            } catch (e) {
                /******/ if (typeof window === "object") return window;
                /******/
            }
            /******/
        })();
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */
    /******/ !(function () {
        /******/ __webpack_require__.o = function (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        };
        /******/
    })();
    /******/
    /******/ /* webpack/runtime/make namespace object */
    /******/ !(function () {
        /******/ // define __esModule on exports
        /******/ __webpack_require__.r = function (exports) {
            /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                /******/ Object.defineProperty(exports, Symbol.toStringTag, {
                    value: "Module",
                });
                /******/
            }
            /******/ Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            /******/
        };
        /******/
    })();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
    !(function () {
        "use strict";
        /*!*************************************!*\
  !*** ./src/arquivos/js/checkout.js ***!
  \*************************************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
                /*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js"
            );
        /* harmony import */ var regenerator_runtime__WEBPACK_IMPORTED_MODULE_0___default =
            /*#__PURE__*/ __webpack_require__.n(
                regenerator_runtime__WEBPACK_IMPORTED_MODULE_0__
            );
        /* harmony import */ var _components_Exemple_js__WEBPACK_IMPORTED_MODULE_1__ =
            __webpack_require__(
                /*! ./components/Exemple.js */ "./src/arquivos/js/components/Exemple.js"
            );
        /* harmony import */ var _components_CodeSeller_js__WEBPACK_IMPORTED_MODULE_2__ =
            __webpack_require__(
                /*! ./components/CodeSeller.js */ "./src/arquivos/js/components/CodeSeller.js"
            );
        /* harmony import */ var _lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_3__ =
            __webpack_require__(
                /*! ./lib/jquery.mask.min.js */ "./src/arquivos/js/lib/jquery.mask.min.js"
            );
        /* harmony import */ var _lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_3___default =
            /*#__PURE__*/ __webpack_require__.n(
                _lib_jquery_mask_min_js__WEBPACK_IMPORTED_MODULE_3__
            );
        /* harmony import */ var _components_priceMeterPromotion_js__WEBPACK_IMPORTED_MODULE_4__ =
            __webpack_require__(
                /*! ./components/priceMeterPromotion.js */ "./src/arquivos/js/components/priceMeterPromotion.js"
            );

        class Checkout {
            constructor() {
                this.init();
            }

            init() {
                new _components_Exemple_js__WEBPACK_IMPORTED_MODULE_1__[
                    "default"
                ]();
                new _components_CodeSeller_js__WEBPACK_IMPORTED_MODULE_2__[
                    "default"
                ]();
                new _components_priceMeterPromotion_js__WEBPACK_IMPORTED_MODULE_4__[
                    "default"
                ]();
                // new WarehouseValidation();
                // new SalesmanCode();
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

        !(function (t, e, i) {
            var r = t.createElement("script"),
                s = t.getElementsByTagName("body")[0];
            (r.type = "text/javascript"),
                (r.src =
                    "https://pppvtex.paymee.com.br/paymee.parcelado.vtex.js?" +
                    new Date().getMilliseconds()),
                (r.id = "paymeeInstallment"),
                s.appendChild(r);
        })(document);
    })();
    /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tvdXQ2LWN1c3RvbS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEVBQTRFO0FBQzVFLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJDQUEyQyxpREFBaUQ7O0FBRTVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsTUFBTTtBQUNOLGVBQWU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsdURBQXVEO0FBQzdGO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxXQUFXO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0MsZ0JBQWdCO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQyxjQUFjO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixnQkFBZ0I7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUEsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLCtDQUErQyxRQUFRO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FB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QUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0EsZUFBZSw0QkFBNEI7V0FDM0MsZUFBZTtXQUNmLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRCw4Q0FBOEM7Ozs7O1dDQTlDO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QjtBQUNpQjtBQUNNO0FBQ2xCO0FBQ29DOztBQUV0RTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVksOERBQU87QUFDbkIsWUFBWSxpRUFBVTtBQUN0QixZQUFZLDBFQUFtQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLFciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGVja291dC8uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvLi9zcmMvYXJxdWl2b3MvanMvY29tcG9uZW50cy9Db2RlU2VsbGVyLmpzIiwid2VicGFjazovL2NoZWNrb3V0Ly4vc3JjL2FycXVpdm9zL2pzL2NvbXBvbmVudHMvRXhlbXBsZS5qcyIsIndlYnBhY2s6Ly9jaGVja291dC8uL3NyYy9hcnF1aXZvcy9qcy9jb21wb25lbnRzL3ByaWNlTWV0ZXJQcm9tb3Rpb24uanMiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvLi9zcmMvYXJxdWl2b3MvanMvaGVscGVycy93YWl0Rm9yRWwuanMiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvLi9zcmMvYXJxdWl2b3MvanMvbGliL2pxdWVyeS5tYXNrLm1pbi5qcyIsIndlYnBhY2s6Ly9jaGVja291dC8uL3NyYy9hcnF1aXZvcy9qcy9zZXJ2aWNlcy9TZXJ2aWNlRXhlbXBsZS5qcyIsIndlYnBhY2s6Ly9jaGVja291dC9leHRlcm5hbCB2YXIgXCJqUXVlcnlcIiIsIndlYnBhY2s6Ly9jaGVja291dC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jaGVja291dC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jaGVja291dC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jaGVja291dC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NoZWNrb3V0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2hlY2tvdXQvLi9zcmMvYXJxdWl2b3MvanMvY2hlY2tvdXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB8fCBmdW5jdGlvbiAob2JqLCBrZXksIGRlc2MpIHsgb2JqW2tleV0gPSBkZXNjLnZhbHVlOyB9O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyBJRSA4IGhhcyBhIGJyb2tlbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhhdCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLlxuICAgIGRlZmluZSh7fSwgXCJcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBkZWZpbmVQcm9wZXJ0eShnZW5lcmF0b3IsIFwiX2ludm9rZVwiLCB7IHZhbHVlOiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIH0pO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBkZWZpbmUoSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIGRlZmluZVByb3BlcnR5KEdwLCBcImNvbnN0cnVjdG9yXCIsIHsgdmFsdWU6IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLCBjb25maWd1cmFibGU6IHRydWUgfSk7XG4gIGRlZmluZVByb3BlcnR5KFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIFwiY29uc3RydWN0b3JcIixcbiAgICB7IHZhbHVlOiBHZW5lcmF0b3JGdW5jdGlvbiwgY29uZmlndXJhYmxlOiB0cnVlIH1cbiAgKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBkZWZpbmUoXG4gICAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUsXG4gICAgdG9TdHJpbmdUYWdTeW1ib2wsXG4gICAgXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICk7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgZGVmaW5lKHByb3RvdHlwZSwgbWV0aG9kLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgZGVmaW5lKGdlbkZ1biwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yRnVuY3Rpb25cIik7XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIGRlZmluZVByb3BlcnR5KHRoaXMsIFwiX2ludm9rZVwiLCB7IHZhbHVlOiBlbnF1ZXVlIH0pO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgZGVmaW5lKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlLCBhc3luY0l0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0pO1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgR2VuZXJhdG9yUmVzdW1lIGJlaGF2aW9yIHNwZWNpZmllZCBzaW5jZSBFUzIwMTU6XG4gICAgICAgIC8vIEVTMjAxNSBzcGVjLCBzdGVwIDM6IGh0dHBzOi8vMjYyLmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvNi4wLyNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIC8vIExhdGVzdCBzcGVjLCBzdGVwIDI6IGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kTmFtZSA9IGNvbnRleHQubWV0aG9kO1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2ROYW1lXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kLCBvciBhIG1pc3NpbmcgLm5leHQgbWV0aG9kLCBhbHdheXMgdGVybWluYXRlIHRoZVxuICAgICAgLy8geWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgIGlmIChtZXRob2ROYW1lID09PSBcInRocm93XCIgJiYgZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1ldGhvZE5hbWUgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ1wiICsgbWV0aG9kTmFtZSArIFwiJyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgZGVmaW5lKEdwLCB0b1N0cmluZ1RhZ1N5bWJvbCwgXCJHZW5lcmF0b3JcIik7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBkZWZpbmUoR3AsIGl0ZXJhdG9yU3ltYm9sLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSk7XG5cbiAgZGVmaW5lKEdwLCBcInRvU3RyaW5nXCIsIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9KTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIHZhciBvYmplY3QgPSBPYmplY3QodmFsKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlICE9IG51bGwpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcih0eXBlb2YgaXRlcmFibGUgKyBcIiBpcyBub3QgaXRlcmFibGVcIik7XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgaW4gbW9kZXJuIGVuZ2luZXNcbiAgLy8gd2UgY2FuIGV4cGxpY2l0bHkgYWNjZXNzIGdsb2JhbFRoaXMuIEluIG9sZGVyIGVuZ2luZXMgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZ2xvYmFsVGhpcy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xuICB9IGVsc2Uge1xuICAgIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvZGVTZWxsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlkRG9jdW1lbnQgPSBcIlwiO1xuICAgICAgICB0aGlzLmRlYm91bmNlVGltZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmhhc1ZlbmRvckRpc3BsYXllZCA9IGZhbHNlOyAvLyBGbGFnIHBhcmEgZ2FyYW50aXIgcXVlIG8gdmVuZGVkb3Igc2VqYSBleGliaWRvIHVtYSB2ZXpcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uQ29udGVudE1hcmtldGluZ0RhdGEoKVxuICAgICAgICB0aGlzLmxvYWRTYXZlZENvdXBvbigpO1xuICAgICAgICB0aGlzLmhhbmRsZUNvdXBvbigpO1xuICAgICAgICB0aGlzLmhhbmRsZUlucHV0Q2hhbmdlKCk7XG5cbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gJChcImJ1dHRvbiNzYWxlc21hbmNvZGUtcmVtb3ZlXCIpO1xuXG4gICAgICAgICAgICBpZiAoIWJ1dHRvbi5oYXNDbGFzcyhcImFjdGl2ZVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ291cG9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cblxuICAgIHZhbGlkYXRpb25Db250ZW50TWFya2V0aW5nRGF0YSgpIHtcbiAgICAgICAgZmV0Y2goYC9hcGkvY2hlY2tvdXQvcHViL29yZGVyRm9ybWApLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpLnRoZW4oKG9yZGVyRm9ybSkgPT4ge1xuICAgICAgICAgICAgaWYgKG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhPy51dG1pQ2FtcGFpZ24pIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaGFzVmVuZG9yRGlzcGxheWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzdWx0VmVuZG9yRGF0YShvcmRlckZvcm0ubWFya2V0aW5nRGF0YS51dG1pQ2FtcGFpZ24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRJbnB1dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgcmVzdWx0VmVuZG9yRGF0YShjb2QpIHtcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICB1cmw6IGAvY3VzdG9tcmVxdWVzdC9nZXR2ZW5kb3Jjb2RlLyR7Y29kfWAsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaG93VmVuZG9ySW5mbyhyZXNwb25zZVswXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHRcIikuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZXJyb3JcIj5Dw7NkaWdvIGRlIFZlbmRlZG9yIGludsOhbGlkbyE8L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJybykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJybyk7XG4gICAgICAgICAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHRcIikuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJlcnJvclwiPkVycm8gbmEgYnVzY2EgZG8gY8OzZGlnbyBkbyB2ZW5kZWRvcjwvZGl2PidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2hvd1ZlbmRvckluZm8odmVuZG9yRGF0YSkge1xuICAgICAgICAvLyBWZXJpZmljYSBzZSBqw6EgZm9pIGV4aWJpZG8gcGFyYSBldml0YXIgcmVwZXRpw6fDo29cbiAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHR0XCIpLnJlbW92ZSgpO1xuXG4gICAgICAgIGxldCBodG1sID0gYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNhbGVzbWFuLXJlc3VsdHRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2hvdy1zYWxlc21hbmNvZGVcIj5WZW5kZWRvcjogJHt2ZW5kb3JEYXRhLmNvZGlnb3ZlbmRlZG9yfSAtICR7dmVuZG9yRGF0YS5ub21lfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzYWxlc21hbmNvZGUtcmVtb3ZlXCIgY2xhc3M9XCJjYXJ0LXNhbGVzbWFuY29kZS1yZW1vdmVcIj5SZW1vdmVyPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcblxuICAgICAgICB0aGlzLndhaXRGb3JFbChcIi5mb3Jtcy5jb3Vwb24tY29sdW1uLnN1bW1hcnktY291cG9uLXdyYXBcIilcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAkKFwiLmZvcm1zLmNvdXBvbi1jb2x1bW4uc3VtbWFyeS1jb3Vwb24td3JhcFwiKS5wcmVwZW5kKGh0bWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzVmVuZG9yRGlzcGxheWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNvdXBvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZFNhdmVkQ291cG9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICBcblxuICAgICAgICB2dGV4anMuY2hlY2tvdXQuc2V0Q3VzdG9tRGF0YSh7IGFwcDogJ2NvZGlnb3ZlbmRlZG9yJywgZmllbGQ6ICdjb2RpZ29WZW5kZWRvcicsIHZhbHVlOiBgJHt2ZW5kb3JEYXRhLmNvZGlnb3ZlbmRlZG9yfWAgfSk7XG5cbiAgICAgICAgdnRleGpzLmNoZWNrb3V0LmdldE9yZGVyRm9ybSgpLnRoZW4oZnVuY3Rpb24gKG9yZGVyRm9ybSkge1xuICAgICAgICAgICAgY29uc3QgbWFya2V0aW5nRGF0YSA9IG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhO1xuICAgICAgICAgICAgbWFya2V0aW5nRGF0YS51dG1pQ2FtcGFpZ24gPSBgJHt2ZW5kb3JEYXRhLmNvZGlnb3ZlbmRlZG9yfWA7XG5cbiAgICAgICAgICAgIHJldHVybiB2dGV4anMuY2hlY2tvdXQuc2VuZEF0dGFjaG1lbnQoXCJtYXJrZXRpbmdEYXRhXCIsIG1hcmtldGluZ0RhdGEpO1xuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChvcmRlckZvcm0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhLCBcIm1hcmtldGluZ0RhdGEgYXR1YWxpemFkb1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZW1vdmVDb3Vwb24oKTtcbiAgICB9XG5cbiAgICBhZGRJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICgkKFwiLnNhbGVzbWFuLWNvdXBvblwiKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGxldCBodG1sID0gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwic2FsZXNtYW4tY291cG9uIG5ldy1jb2RlLXNhbGVzbWFuXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aXRsZS1zYWxlc21hbi1jb3Vwb25cIj5Dw7NkaWdvIGRvIFZlbmRlZG9yPC9zcGFuPlxuICAgICAgICAgIDxmb3JtIGNsYXNzPVwic2FsZXNtYW4tY291cG9uLWZvcm1cIj5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRXNjcmV2YSBvIEPDs2RpZ28gZG8gVmVuZGVkb3JcIiBuYW1lPVwiY29kaWdvdmVuZGVkb3JcIiBpZD1cImNvZGlnb3ZlbmRlZG9yXCIgLz5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiY291cG9uLXNlbmRcIj5BcGxpY2FyPC9idXR0b24+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzYWxlc21hbi1yZXN1bHRcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICBgO1xuXG4gICAgICAgIF90aGlzXG4gICAgICAgICAgICAud2FpdEZvckVsKFwiLmZvcm1zLmNvdXBvbi1jb2x1bW4uc3VtbWFyeS1jb3Vwb24td3JhcFwiKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICQoXCIuZm9ybXMuY291cG9uLWNvbHVtbi5zdW1tYXJ5LWNvdXBvbi13cmFwXCIpLnByZXBlbmQoaHRtbCk7XG4gICAgICAgICAgICAgICAgX3RoaXMubG9hZFNhdmVkQ291cG9uKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUlucHV0Q2hhbmdlKCkge1xuICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oXCJpbnB1dFwiLCBcIiNjb2RpZ292ZW5kZWRvclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gJCh0aGlzKS52YWwoKTtcblxuICAgICAgICAgICAgaWYgKF90aGlzLmRlYm91bmNlVGltZXIpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoX3RoaXMuZGVib3VuY2VUaW1lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF90aGlzLmRlYm91bmNlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5mZXRjaFZlbmRvckRhdGEoaW5wdXRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHRcIikuaHRtbChcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmZXRjaFZlbmRvckRhdGEoY29kKSB7XG4gICAgICAgIGNvbnN0IF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBgL2N1c3RvbXJlcXVlc3QvZ2V0dmVuZG9yY29kZS8ke2NvZH1gLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2hvd1ZlbmRvckRhdGEocmVzcG9uc2VbMF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuc2FsZXNtYW4tcmVzdWx0XCIpLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImVycm9yXCI+Q8OzZGlnbyBkZSBWZW5kZWRvciBpbnbDoWxpZG8hPC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm8pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm8pO1xuICAgICAgICAgICAgICAgICQoXCIuc2FsZXNtYW4tcmVzdWx0XCIpLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZXJyb3JcIj5FcnJvIG5hIGJ1c2NhIGRvIGPDs2RpZ28gZG8gdmVuZGVkb3I8L2Rpdj4nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3dWZW5kb3JEYXRhKHZlbmRvckRhdGEpIHtcbiAgICAgICAgY29uc3QgaHRtbCA9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInNob3ctc2FsZXNtYW5jb2RlXCI+XG4gICAgICAgICAgICBWZW5kZWRvcjogJHt2ZW5kb3JEYXRhLmNvZGlnb3ZlbmRlZG9yfSAtICR7dmVuZG9yRGF0YS5ub21lfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHRcIikuaHRtbChodG1sKTtcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlQ291cG9uKCkge1xuICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oXCJzdWJtaXRcIiwgXCJmb3JtLnNhbGVzbWFuLWNvdXBvbi1mb3JtXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGxldCBjb2QgPSAkKHRoaXMpLmZpbmQoXCIjY29kaWdvdmVuZGVkb3JcIikudmFsKCk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIHVybDogYC9jdXN0b21yZXF1ZXN0L2dldHZlbmRvcmNvZGUvJHtjb2R9YCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmlkRG9jdW1lbnQgPSByZXNwb25zZVswXS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmluZm9WZW5kZWRvcihfdGhpcy5pZERvY3VtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuc2FsZXNtYW4tY291cG9uLWZvcm1cIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi50aXRsZS1zYWxlc21hbi1jb3Vwb25cIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDw7NkaWdvIGRlIFZlbmRlZG9yIGludsOhbGlkbyEgVGVudGUgb3V0cm8gY8OzZGlnb1wiXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm8pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluZm9WZW5kZWRvcihpZERvY3VtZW50KSB7XG4gICAgICAgIGNvbnN0IF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgdXJsOiBgL2N1c3RvbXJlcXVlc3QvZ2V0dmVuZG9yZGF0YS8ke2lkRG9jdW1lbnR9YCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY29udGVudFZhbGlkQ291cG9uKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2F2ZUNvdXBvblRvTG9jYWxTdG9yYWdlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIkPDs2RpZ28gZGUgVmVuZGVkb3IgaW52w6FsaWRvISBUZW50ZSBvdXRybyBjw7NkaWdvXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGVycm8pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm8pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29udGVudFZhbGlkQ291cG9uKGNvbnRlbnQpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cudnRleGpzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBfdGhpcyA9IHRoaXM7XG4gIFxuICAgICAgICBjb25zdCBodG1sID0gYFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNob3ctc2FsZXNtYW5jb2RlXCI+XG4gICAgICAgICAgICAgICAgVmVuZGVkb3I6ICR7Y29udGVudC5jb2RpZ292ZW5kZWRvcn0gLSAke2NvbnRlbnQubm9tZX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhbGVzbWFuY29kZS1yZW1vdmVcIiBjbGFzcz1cImNhcnQtc2FsZXNtYW5jb2RlLXJlbW92ZVwiPlxuICAgICAgICAgICAgICAgIFJlbW92ZXJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICBgO1xuXG4gICAgICAgICQoXCIuc2FsZXNtYW4tcmVzdWx0XCIpLmh0bWwoaHRtbCk7XG5cbiAgICAgICAgdnRleGpzPy5jaGVja291dD8uc2V0Q3VzdG9tRGF0YSh7IGFwcDogJ2NvZGlnb3ZlbmRlZG9yJywgZmllbGQ6ICdjb2RpZ29WZW5kZWRvcicsIHZhbHVlOiBgJHtjb250ZW50LmNvZGlnb3ZlbmRlZG9yfWAgfSk7XG5cbiAgICAgICAgdnRleGpzLmNoZWNrb3V0LmdldE9yZGVyRm9ybSgpLnRoZW4oZnVuY3Rpb24gKG9yZGVyRm9ybSkge1xuICAgICAgICAgICAgY29uc3QgbWFya2V0aW5nRGF0YSA9IG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhO1xuICAgICAgICAgICAgbWFya2V0aW5nRGF0YS51dG1pQ2FtcGFpZ24gPSBgJHtjb250ZW50LmNvZGlnb3ZlbmRlZG9yfWA7XG5cbiAgICAgICAgICAgIHJldHVybiB2dGV4anMuY2hlY2tvdXQuc2VuZEF0dGFjaG1lbnQoXCJtYXJrZXRpbmdEYXRhXCIsIG1hcmtldGluZ0RhdGEpO1xuICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChvcmRlckZvcm0pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhLCBcIm1hcmtldGluZ0RhdGEgYXR1YWxpemFkb1wiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgX3RoaXMucmVtb3ZlQ291cG9uKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ291cG9uKCkge1xuICAgICAgICAkKFwiYnV0dG9uI3NhbGVzbWFuY29kZS1yZW1vdmVcIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cbiAgICAgICAgJChcImJ1dHRvbiNzYWxlc21hbmNvZGUtcmVtb3ZlXCIpLm9uKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgJChcIi5zaG93LXNhbGVzbWFuY29kZSwgLmNhcnQtc2FsZXNtYW5jb2RlLXJlbW92ZVwiKS5oaWRlKCk7XG4gICAgICAgICAgICAkKFwiLnNhbGVzbWFuLWNvdXBvbi1mb3JtXCIpLnNob3coKTtcbiAgICAgICAgICAgICQoXCIudGl0bGUtc2FsZXNtYW4tY291cG9uXCIpLnNob3coKTtcblxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJzYWxlc21hbkRhdGFcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZldGNoKFxuICAgICAgICAgICAgICAgIGAvYXBpL2NoZWNrb3V0L3B1Yi9vcmRlckZvcm0vJHt2dGV4anM/LmNoZWNrb3V0Py5vcmRlckZvcm1JZH0vY3VzdG9tRGF0YS9jb2RpZ292ZW5kZWRvci9jb2RpZ29WZW5kZWRvcmAsXG4gICAgICAgICAgICAgICAgb3B0aW9uc1xuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvIGFvIHJlbW92ZXIgY3VzdG9tRGF0YTpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2dGV4anMuY2hlY2tvdXQuZ2V0T3JkZXJGb3JtKCkudGhlbihmdW5jdGlvbiAob3JkZXJGb3JtKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFya2V0aW5nRGF0YSA9IG9yZGVyRm9ybS5tYXJrZXRpbmdEYXRhO1xuICAgICAgICAgICAgICAgIG1hcmtldGluZ0RhdGEudXRtaUNhbXBhaWduID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2dGV4anMuY2hlY2tvdXQuc2VuZEF0dGFjaG1lbnQoXCJtYXJrZXRpbmdEYXRhXCIsIG1hcmtldGluZ0RhdGEpO1xuICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAob3JkZXJGb3JtKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cob3JkZXJGb3JtLm1hcmtldGluZ0RhdGEsIFwiQ8OzZGlnbyBkZSB2ZW5kZWRvciByZW1vdmlkb1wiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmFkZElucHV0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNhdmVDb3Vwb25Ub0xvY2FsU3RvcmFnZShjb250ZW50KSB7XG4gICAgICAgIGNvbnN0IHNhbGVzbWFuRGF0YSA9IHtcbiAgICAgICAgICAgIGNvZGlnb3ZlbmRlZG9yOiBjb250ZW50LmNvZGlnb3ZlbmRlZG9yLFxuICAgICAgICAgICAgbm9tZTogY29udGVudC5ub21lLFxuICAgICAgICB9O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNhbGVzbWFuRGF0YVwiLCBKU09OLnN0cmluZ2lmeShzYWxlc21hbkRhdGEpKTtcbiAgICB9XG5cbiAgICBsb2FkU2F2ZWRDb3Vwb24oKSB7XG4gICAgICAgIGlmICghd2luZG93LnZ0ZXhqcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IHNhdmVkRGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2FsZXNtYW5EYXRhXCIpO1xuXG4gICAgICAgIGlmIChzYXZlZERhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnBhcnNlKHNhdmVkRGF0YSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBgXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNob3ctc2FsZXNtYW5jb2RlXCI+XG4gICAgICAgICAgICAgICAgICAgIFZlbmRlZG9yOiAke2NvbnRlbnQuY29kaWdvdmVuZGVkb3J9IC0gJHtjb250ZW50Lm5vbWV9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNhbGVzbWFuY29kZS1yZW1vdmVcIiBjbGFzcz1cImNhcnQtc2FsZXNtYW5jb2RlLXJlbW92ZVwiPlxuICAgICAgICAgICAgICAgICAgICBSZW1vdmVyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+YDtcblxuICAgICAgICAgICAgJChcIi5zYWxlc21hbi1yZXN1bHRcIikuaHRtbChodG1sKTtcbiAgICAgICAgICAgICQoXCIuc2FsZXNtYW4tY291cG9uLWZvcm1cIikuaGlkZSgpO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3YWl0Rm9yRWwoc2VsZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBpZiAoJChzZWxlY3RvcikubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgkKHNlbGVjdG9yKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkKHNlbGVjdG9yKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgkKHNlbGVjdG9yKSk7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHdhaXRGb3JFbCBmcm9tIFwiLi4vaGVscGVycy93YWl0Rm9yRWxcIjtcbmltcG9ydCBTZXJ2aWNlRXhlbXBsZSBmcm9tIFwiLi4vc2VydmljZXMvU2VydmljZUV4ZW1wbGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhlbXBsZSB7XG4gICAgc2VydmljZUV4ZW1wbGUgPSBuZXcgU2VydmljZUV4ZW1wbGUoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RvcnMoKTtcbiAgICAgICAgdGhpcy5ldmVudHMoKTtcbiAgICB9XG5cbiAgICBzZWxlY3RvcnMoKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSAkKFwiLmV4YW1wbGUtdGl0bGVcIik7XG4gICAgfVxuXG4gICAgZXZlbnRzKCkge1xuICAgICAgICB0aGlzLnRpdGxlLmNsaWNrKHRoaXMuZXhlbXBsZUV2ZW50LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiaGFzaGNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT0gXCIjL3NoaXBwaW5nXCIpIHtcbiAgICAgICAgICAgICAgICB3YWl0Rm9yRWwoXCIjc2hpcC1jb21wbGVtZW50XCIpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuXG4gICAgICAgICAgICAgICAgICAgIC8vZGV2ZWxvcFxuICAgICAgICAgICAgICAgICAgICAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCAhPSBcIiMvY2FydFwiKSB7XG4gICAgICAgICAgICAgICAgd2FpdEZvckVsKFwiLnN1bW1hcnktY2FydC10ZW1wbGF0ZS1ob2xkZXIgLmhwcm9kdWN0IC5waG90b1wiKVxuICAgICAgICAgICAgICAgICAgICAudGhlblxuICAgICAgICAgICAgICAgICAgICAvL2RldmVsb3BcbiAgICAgICAgICAgICAgICAgICAgKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQod2luZG93KS5vbihcIm9yZGVyRm9ybVVwZGF0ZWQudnRleFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBvcmRlckZvcm1EYXRhID0gdnRleGpzLmNoZWNrb3V0Lm9yZGVyRm9ybTtcbiAgICAgICAgICAgIGxldCBwb3N0YWxDb2RlID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIG9yZGVyRm9ybURhdGEuc2hpcHBpbmdEYXRhICYmXG4gICAgICAgICAgICAgICAgb3JkZXJGb3JtRGF0YS5zaGlwcGluZ0RhdGEuYWRkcmVzcyAmJlxuICAgICAgICAgICAgICAgIG9yZGVyRm9ybURhdGEuc2hpcHBpbmdEYXRhLmFkZHJlc3MucG9zdGFsQ29kZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcG9zdGFsQ29kZSA9IG9yZGVyRm9ybURhdGEuc2hpcHBpbmdEYXRhLmFkZHJlc3MucG9zdGFsQ29kZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgb3JkZXJGb3JtRGF0YS5zaGlwcGluZ0RhdGEgJiZcbiAgICAgICAgICAgICAgICBvcmRlckZvcm1EYXRhLnNoaXBwaW5nRGF0YS5hdmFpbGFibGVBZGRyZXNzZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcG9zdGFsQ29kZSA9XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyRm9ybURhdGEuc2hpcHBpbmdEYXRhLmF2YWlsYWJsZUFkZHJlc3Nlc1swXS5wb3N0YWxDb2RlOyAvLyBBc3N1bWUgcXVlIG8gcHJpbWVpcm8gZW5kZXJlw6dvIGRpc3BvbsOtdmVsIMOpIG8gcHJpbmNpcGFsXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcG9zdGFsQ29kZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiUG9zdGFsIENvZGUgbsOjbyBkaXNwb27DrXZlbC4gUmVxdWlzacOnw6NvIG7Do28gc2Vyw6EgZmVpdGEuXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3JkZXJGb3JtRGF0YS5pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbURhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgICAgICAgICBxdWFudGl0eTogaXRlbS5xdWFudGl0eSxcbiAgICAgICAgICAgICAgICAgICAgc2VsbGVyOiBcIjFcIixcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZmV0Y2goXG4gICAgICAgICAgICAgICAgICAgIFwiL2FwaS9jaGVja291dC9wdWIvb3JkZXJGb3Jtcy9zaW11bGF0aW9uP1JuYkJlaGF2aW9yPTAmc2M9MSZpbmRpdmlkdWFsU2hpcHBpbmdFc3RpbWF0ZXM9dHJ1ZVwiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbaXRlbURhdGFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhbENvZGU6IHBvc3RhbENvZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRyeTogXCJCUkFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZE9yZGVyRm9ybVNlY3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXRlbXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b3RhbGl6ZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2hpcHBpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoZGF0YVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhUmVzcG9uc2UsIFwiZGF0YVJlc3BvbnNlXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVJlc3BvbnNlLmxvZ2lzdGljc0luZm8gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhUmVzcG9uc2UubG9naXN0aWNzSW5mby5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGlwcGluZ0VzdGltYXRlcyA9IGRhdGFSZXNwb25zZS5sb2dpc3RpY3NJbmZvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgobG9naXN0aWNzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzbGEgPSBsb2dpc3RpY3Muc2xhcy5maW5kKChzbGEpID0+IHNsYS5pZCA9PT0gXCJTRURFWFwiKTtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2xhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbGEgPSBsb2dpc3RpY3Muc2xhcy5maW5kKChzbGEpID0+IHNsYS5pZCA9PT0gXCJOb3JtYWxcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzbGEgPyBzbGEuc2hpcHBpbmdFc3RpbWF0ZSA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNoaXBwaW5nRXN0aW1hdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNoaXBwaW5nRXN0aW1hdGUgPSBzaGlwcGluZ0VzdGltYXRlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2hpcHBpbmdFc3RpbWF0ZSwgXCJzaGlwcGluZ0VzdGltYXRlXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXBwaW5nRXN0aW1hdGUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpcHBpbmdFc3RpbWF0ZS5tYXRjaCgvXFxkKy8pWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICEkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAucHJvZHVjdC1pdGVtW2RhdGEtc2t1PSR7aXRlbS5pZH1dIC5zaGlwcGluZy1kYXRlIC5zaGlwcGluZy1lc3RpbWF0ZS1kYXRlYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5maW5kKGAuY3VzdG9tLW1lc3NhZ2UtJHtpdGVtLmlkfWApLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBwaW5nTWVzc2FnZSA9IGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPSdjdXN0b20tbWVzc2FnZS1pbmZvIGN1c3RvbS1tZXNzYWdlLSR7aXRlbS5pZH0nPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVtIGF0w6kgJHtzaGlwcGluZ0VzdGltYXRlfSBkaWFzIMO6dGVpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAucHJvZHVjdC1pdGVtW2RhdGEtc2t1PSR7aXRlbS5pZH1dIC5zaGlwcGluZy1kYXRlIC5zaGlwcGluZy1lc3RpbWF0ZS1kYXRlYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5hcHBlbmQoc2hpcHBpbmdNZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgTmVuaHVtIFNMQSBjb20gaWQgJ1NFREVYJyBlbmNvbnRyYWRvIHBhcmEgbyBpdGVtICR7aXRlbS5pZH0uYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYE5lbmh1bWEgaW5mb3JtYcOnw6NvIGRlIGxvZ2lzdGljc0luZm8gZW5jb250cmFkYSBwYXJhIG8gaXRlbSAke2l0ZW0uaWR9LmBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzbGFFbGVtZW50cyA9ICQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuc3JwLXNoaXBwaW5nLWN1cnJlbnQtc2luZ2xlX19zbGEuZ3JheVwiXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB3YWl0Rm9yRWwoc2xhRWxlbWVudHMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsYUVsZW1lbnRzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzbGFUZXh0ID0gJCh0aGlzKS50ZXh0KCkudHJpbSgpOyBcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNsYVRleHQuaW5jbHVkZXMoXCJQcm9udG8gZW0gYXTDqVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5jdXN0b20tbWVzc2FnZS1pbmZvXCIpLmhpZGUoKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBwaW5nRXN0aW1hdGVEYXRlRWxlbWVudCA9ICQoXCIuc2hpcHBpbmctZXN0aW1hdGUtZGF0ZVwiKVxuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNoaXBwaW5nRXN0aW1hdGVEYXRlRWxlbWVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwcGluZ0VzdGltYXRlRGF0ZUVsZW1lbnQuYWRkQ2xhc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWN0aXZlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvIHBhcmEgbyBpdGVtICR7aXRlbS5pZH06YCwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKHdpbmRvdykub24oXCJvcmRlckZvcm1VcGRhdGVkLnZ0ZXhcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9IFwiIy9jYXJ0XCIpIHtcbiAgICAgICAgICAgICAgICB3YWl0Rm9yRWwoXCIuaHByb2R1Y3QgLnBob3RvXCIpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4ZW1wbGVNZXRob2QoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXhlbXBsZUV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXZlbnRcIiwgZXZlbnQpO1xuICAgIH1cblxuICAgIGV4ZW1wbGVNZXRob2QoKSB7XG4gICAgICAgIHRoaXMudGl0bGUuYWRkQ2xhc3MoXCJ0ZXN0ZVwiKTtcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXhlbXBsZS5nZXRBbGxJbmZvQ2xpZW50KDEpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIHByaWNlTWV0ZXJQcm9tb3Rpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgICAgICQod2luZG93KS5vbihcIm9yZGVyRm9ybVVwZGF0ZWQudnRleFwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudmFsaWRhdGlvblByaWNlTWV0ZXJQcm9tb3Rpb24oKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKHdpbmRvdykub24oXCJoYXNoY2hhbmdlXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uUHJpY2VNZXRlclByb21vdGlvbigpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB2YWxpZGF0aW9uUHJpY2VNZXRlclByb21vdGlvbigpIHtcbiAgICB0aGlzLndhaXRGb3JFbChcIi5uZXctcHJvZHVjdC1yZWFsLXByaWNlLXBlci11bml0XCIpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuY3JlYXRlUHJpY2VNZXRlclByb21vdGlvbigpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm8gYW8gZXNwZXJhciBwZWxvIGVsZW1lbnRvOlwiLCBlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZVByaWNlTWV0ZXJQcm9tb3Rpb24oKSB7XG4gICAgY29uc3Qgb3JkZXJGb3JtID0gdnRleGpzLmNoZWNrb3V0Lm9yZGVyRm9ybTtcblxuICAgIGNvbnN0IGRpc2NvdW50RGF0YSA9IG9yZGVyRm9ybS5yYXRlc0FuZEJlbmVmaXRzRGF0YS5yYXRlQW5kQmVuZWZpdHNJZGVudGlmaWVycy5maW5kKChpZGVudGlmaWVyKSA9PiB7XG4gICAgICByZXR1cm4gaWRlbnRpZmllci5uYW1lICYmIC9cXGQrJS8udGVzdChpZGVudGlmaWVyLm5hbWUpOyAvLyBJZGVudGlmaWNhIGRlc2NvbnRvcyBwb3IgcG9yY2VudGFnZW1cbiAgICB9KTtcblxuICAgIGlmICghZGlzY291bnREYXRhKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJOZW5odW0gY3Vwb20gY29tIGRlc2NvbnRvIGZvaSBlbmNvbnRyYWRvIG5vIG9yZGVyRm9ybS5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGlzY291bnRNYXRjaCA9IGRpc2NvdW50RGF0YS5uYW1lLm1hdGNoKC8oXFxkKyklLyk7XG4gICAgY29uc3QgZGlzY291bnRQZXJjZW50YWdlID0gZGlzY291bnRNYXRjaCA/IHBhcnNlSW50KGRpc2NvdW50TWF0Y2hbMV0sIDEwKSA6IDA7XG5cbiAgICBpZiAoZGlzY291bnRQZXJjZW50YWdlID4gMCkge1xuICAgICAgb3JkZXJGb3JtLml0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsUHJpY2VQZXJNMiA9IGl0ZW0ucHJpY2UgLyAxMDA7IFxuICAgICAgICBjb25zdCBkaXNjb3VudGVkUHJpY2VQZXJNMiA9IG9yaWdpbmFsUHJpY2VQZXJNMiAqICgxIC0gZGlzY291bnRQZXJjZW50YWdlIC8gMTAwKTtcblxuICAgICAgICBjb25zdCBmb3JtYXR0ZWRQcmljZSA9IGRpc2NvdW50ZWRQcmljZVBlck0yLnRvRml4ZWQoMikucmVwbGFjZSgnLicsICcsJyk7XG5cbiAgICAgICAgY29uc3QgcHJvZHVjdENvbnRhaW5lciA9ICQoYC5wcm9kdWN0LWl0ZW1gKS5lcShpbmRleCk7IFxuXG4gICAgICAgIGlmIChwcm9kdWN0Q29udGFpbmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zdCBvcmlnaW5hbFByaWNlRWxlbWVudCA9IHByb2R1Y3RDb250YWluZXIuZmluZCgnLm5ldy1wcm9kdWN0LXJlYWwtcHJpY2UtcGVyLXVuaXQnKS5ub3QoJy5kaXNjb3VudGVkJyk7XG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWxQcmljZVRleHQgPSBvcmlnaW5hbFByaWNlRWxlbWVudC50ZXh0KCkudHJpbSgpO1xuXG4gICAgICAgICAgaWYgKCFvcmlnaW5hbFByaWNlVGV4dCB8fCBpc05hTihwYXJzZUZsb2F0KG9yaWdpbmFsUHJpY2VUZXh0LnJlcGxhY2UoJ1IkJywgJycpLnJlcGxhY2UoJywnLCAnLicpKSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgUHJvZHV0byBcIiR7aXRlbS5uYW1lfVwiIG7Do28gcG9zc3VpIHVtIHByZcOnbyB2w6FsaWRvIHBvciBtwrIuIElnbm9yYW5kby5gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocHJvZHVjdENvbnRhaW5lci5hdHRyKCdkYXRhLWRpc2NvdW50LWFwcGxpZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRGVzY29udG8gasOhIGFwbGljYWRvIGFvIGl0ZW0gXCIke2l0ZW0ubmFtZX1cIi4gSWdub3JhbmRvLmApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHByb2R1Y3RDb250YWluZXIuZmluZCgnLm5ldy1wcm9kdWN0LXJlYWwtcHJpY2UtcGVyLXVuaXQuZGlzY291bnRlZCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgY29uc3QgbmV3UHJpY2VFbGVtZW50ID0gJCgnPHNtYWxsPicsIHtcbiAgICAgICAgICAgIGNsYXNzOiAnbmV3LXByb2R1Y3QtcmVhbC1wcmljZS1wZXItdW5pdCBkaXNjb3VudGVkJyxcbiAgICAgICAgICAgIHRleHQ6IGBSJCAke2Zvcm1hdHRlZFByaWNlfSAvIG3CsmAsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBvcmlnaW5hbFByaWNlRWxlbWVudC5oaWRlKCk7XG5cbiAgICAgICAgICBwcm9kdWN0Q29udGFpbmVyLmZpbmQoJy5wcm9kdWN0LXByaWNlJykuYXBwZW5kKG5ld1ByaWNlRWxlbWVudCk7XG5cbiAgICAgICAgICBwcm9kdWN0Q29udGFpbmVyLmF0dHIoJ2RhdGEtZGlzY291bnQtYXBwbGllZCcsICd0cnVlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBQcm9kdXRvIFwiJHtpdGVtLm5hbWV9XCIgbsOjbyBlbmNvbnRyYWRvIG5vIERPTS5gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihcIk5lbmh1bSBkZXNjb250byBwZXJjZW50dWFsIHbDoWxpZG8gZm9pIGlkZW50aWZpY2Fkby5cIik7XG4gICAgfVxuICB9XG5cbiAgd2FpdEZvckVsKHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBpZiAoJChzZWxlY3RvcikubGVuZ3RoKSB7XG4gICAgICAgIHJlc29sdmUoJChzZWxlY3RvcikpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgaWYgKCQoc2VsZWN0b3IpLmxlbmd0aCkge1xuICAgICAgICAgIHJlc29sdmUoJChzZWxlY3RvcikpO1xuICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBFc3BlcmEgdW0gZWxlbWVudG8gZXhpdGlyIG5vIGRvbSBlIGV4ZWN1dGEgbyBjYWxsYmFja1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBzZWxldG9yIGRvIGVsZW1lbnRvIHF1ZSBkZWplc2EgZXNwZXJhciBwZWxhIGNyaWHDp8Ojb1xuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgRnVuw6fDo28gYSBzZXIgZXhlY3V0YWRhIHF1YW5kbyB0YWwgZWxlbWVudG8gZXhpc3RpclxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdhaXRGb3JFbChzZWxlY3Rvcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBmdW5jdGlvbiB3YWl0Rm9yRWxDYihzKSB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGpRdWVyeShzKTtcbiAgICAgICAgICAgIGlmIChlbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGVsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdhaXRGb3JFbENiKHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdhaXRGb3JFbENiKHNlbGVjdG9yKTtcbiAgICB9KTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVzZWxlc3MtZXNjYXBlICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25kLWFzc2lnbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tZW1wdHkgKi9cbi8vIGpRdWVyeSBNYXNrIFBsdWdpbiB2MS4xNC4xNlxuLy8gZ2l0aHViLmNvbS9pZ29yZXNjb2Jhci9qUXVlcnktTWFzay1QbHVnaW5cbnZhciAkanNjb21wID0gJGpzY29tcCB8fCB7fTtcbiRqc2NvbXAuc2NvcGUgPSB7fTtcbiRqc2NvbXAuZmluZEludGVybmFsID0gZnVuY3Rpb24gKGEsIG4sIGYpIHtcbiAgICBhIGluc3RhbmNlb2YgU3RyaW5nICYmIChhID0gU3RyaW5nKGEpKTtcbiAgICBmb3IgKHZhciBwID0gYS5sZW5ndGgsIGsgPSAwOyBrIDwgcDsgaysrKSB7XG4gICAgICAgIHZhciBiID0gYVtrXTtcbiAgICAgICAgaWYgKG4uY2FsbChmLCBiLCBrLCBhKSkgcmV0dXJuIHsgaTogaywgdjogYiB9O1xuICAgIH1cbiAgICByZXR1cm4geyBpOiAtMSwgdjogdm9pZCAwIH07XG59O1xuJGpzY29tcC5BU1NVTUVfRVM1ID0gITE7XG4kanNjb21wLkFTU1VNRV9OT19OQVRJVkVfTUFQID0gITE7XG4kanNjb21wLkFTU1VNRV9OT19OQVRJVkVfU0VUID0gITE7XG4kanNjb21wLlNJTVBMRV9GUk9VTkRfUE9MWUZJTEwgPSAhMTtcbiRqc2NvbXAuZGVmaW5lUHJvcGVydHkgPVxuICAgICRqc2NvbXAuQVNTVU1FX0VTNSB8fCBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXG4gICAgICAgID8gT2JqZWN0LmRlZmluZVByb3BlcnR5XG4gICAgICAgIDogZnVuY3Rpb24gKGEsIG4sIGYpIHtcbiAgICAgICAgICAgICAgYSAhPSBBcnJheS5wcm90b3R5cGUgJiYgYSAhPSBPYmplY3QucHJvdG90eXBlICYmIChhW25dID0gZi52YWx1ZSk7XG4gICAgICAgICAgfTtcbiRqc2NvbXAuZ2V0R2xvYmFsID0gZnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gXCJ1bmRlZmluZWRcIiAhPSB0eXBlb2Ygd2luZG93ICYmIHdpbmRvdyA9PT0gYVxuICAgICAgICA/IGFcbiAgICAgICAgOiBcInVuZGVmaW5lZFwiICE9IHR5cGVvZiBnbG9iYWwgJiYgbnVsbCAhPSBnbG9iYWxcbiAgICAgICAgPyBnbG9iYWxcbiAgICAgICAgOiBhO1xufTtcbiRqc2NvbXAuZ2xvYmFsID0gJGpzY29tcC5nZXRHbG9iYWwodGhpcyk7XG4kanNjb21wLnBvbHlmaWxsID0gZnVuY3Rpb24gKGEsIG4sIGYsIHApIHtcbiAgICBpZiAobikge1xuICAgICAgICBmID0gJGpzY29tcC5nbG9iYWw7XG4gICAgICAgIGEgPSBhLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgZm9yIChwID0gMDsgcCA8IGEubGVuZ3RoIC0gMTsgcCsrKSB7XG4gICAgICAgICAgICB2YXIgayA9IGFbcF07XG4gICAgICAgICAgICBrIGluIGYgfHwgKGZba10gPSB7fSk7XG4gICAgICAgICAgICBmID0gZltrXTtcbiAgICAgICAgfVxuICAgICAgICBhID0gYVthLmxlbmd0aCAtIDFdO1xuICAgICAgICBwID0gZlthXTtcbiAgICAgICAgbiA9IG4ocCk7XG4gICAgICAgIG4gIT0gcCAmJlxuICAgICAgICAgICAgbnVsbCAhPSBuICYmXG4gICAgICAgICAgICAkanNjb21wLmRlZmluZVByb3BlcnR5KGYsIGEsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6ICEwLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiAhMCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbixcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn07XG4kanNjb21wLnBvbHlmaWxsKFxuICAgIFwiQXJyYXkucHJvdG90eXBlLmZpbmRcIixcbiAgICBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gYVxuICAgICAgICAgICAgPyBhXG4gICAgICAgICAgICA6IGZ1bmN0aW9uIChhLCBmKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJGpzY29tcC5maW5kSW50ZXJuYWwodGhpcywgYSwgZikudjtcbiAgICAgICAgICAgICAgfTtcbiAgICB9LFxuICAgIFwiZXM2XCIsXG4gICAgXCJlczNcIlxuKTtcbihmdW5jdGlvbiAoYSwgbiwgZikge1xuICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIGRlZmluZSAmJiBkZWZpbmUuYW1kXG4gICAgICAgID8gZGVmaW5lKFtcImpxdWVyeVwiXSwgYSlcbiAgICAgICAgOiBcIm9iamVjdFwiID09PSB0eXBlb2YgZXhwb3J0cyAmJiBcInVuZGVmaW5lZFwiID09PSB0eXBlb2YgTWV0ZW9yXG4gICAgICAgID8gKG1vZHVsZS5leHBvcnRzID0gYShyZXF1aXJlKFwianF1ZXJ5XCIpKSlcbiAgICAgICAgOiBhKG4gfHwgZik7XG59KShcbiAgICBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgbiA9IGZ1bmN0aW9uIChiLCBkLCBlKSB7XG4gICAgICAgICAgICB2YXIgYyA9IHtcbiAgICAgICAgICAgICAgICBpbnZhbGlkOiBbXSxcbiAgICAgICAgICAgICAgICBnZXRDYXJldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIgPSBiLmdldCgwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gZG9jdW1lbnQuc2VsZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQgPSByLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtMSA9PT0gbmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZihcIk1TSUUgMTBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlID0gaC5jcmVhdGVSYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUubW92ZVN0YXJ0KFwiY2hhcmFjdGVyXCIsIC1jLnZhbCgpLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYSA9IGUudGV4dC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGQgfHwgXCIwXCIgPT09IGQpIGEgPSBkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKEMpIHt9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXRDYXJldDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiLmlzKFwiOmZvY3VzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSBiLmdldCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYy5zZXRTZWxlY3Rpb25SYW5nZSkgYy5zZXRTZWxlY3Rpb25SYW5nZShhLCBhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGcgPSBjLmNyZWF0ZVRleHRSYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLmNvbGxhcHNlKCEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5tb3ZlRW5kKFwiY2hhcmFjdGVyXCIsIGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLm1vdmVTdGFydChcImNoYXJhY3RlclwiLCBhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZy5zZWxlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKEIpIHt9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBldmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgYi5vbihcImtleWRvd24ubWFza1wiLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYi5kYXRhKFwibWFzay1rZXljb2RlXCIsIGEua2V5Q29kZSB8fCBhLndoaWNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIuZGF0YShcIm1hc2stcHJldml1cy12YWx1ZVwiLCBiLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIuZGF0YShcIm1hc2stcHJldml1cy1jYXJldC1wb3NcIiwgYy5nZXRDYXJldCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMubWFza0RpZ2l0UG9zTWFwT2xkID0gYy5tYXNrRGlnaXRQb3NNYXA7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYS5qTWFza0dsb2JhbHMudXNlSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImlucHV0Lm1hc2tcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwia2V5dXAubWFza1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMuYmVoYXZpb3VyXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJwYXN0ZS5tYXNrIGRyb3AubWFza1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIua2V5ZG93bigpLmtleXVwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oXCJjaGFuZ2UubWFza1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYi5kYXRhKFwiY2hhbmdlZFwiLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwiYmx1ci5tYXNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID09PSBjLnZhbCgpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuZGF0YShcImNoYW5nZWRcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYi50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIuZGF0YShcImNoYW5nZWRcIiwgITEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbihcImJsdXIubWFza1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGMudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwiZm9jdXMubWFza1wiLCBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICEwID09PSBlLnNlbGVjdE9uRm9jdXMgJiYgYShiLnRhcmdldCkuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKFwiZm9jdXNvdXQubWFza1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5jbGVhcklmTm90TWF0Y2ggJiYgIWsudGVzdChjLnZhbCgpKSAmJiBjLnZhbChcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0UmVnZXhNYXNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGEgPSBbXSwgYiwgYywgZSwgdCwgZiA9IDA7IGYgPCBkLmxlbmd0aDsgZisrKVxuICAgICAgICAgICAgICAgICAgICAgICAgKGIgPSBsLnRyYW5zbGF0aW9uW2QuY2hhckF0KGYpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICgoYyA9IGIucGF0dGVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLy57MX0kfF4uezF9L2csIFwiXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChlID0gYi5vcHRpb25hbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoYiA9IGIucmVjdXJzaXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGEucHVzaChkLmNoYXJBdChmKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodCA9IHsgZGlnaXQ6IGQuY2hhckF0KGYpLCBwYXR0ZXJuOiBjIH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYS5wdXNoKGUgfHwgYiA/IGMgKyBcIj9cIiA6IGMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogYS5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNoYXJBdChmKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCBcIlxcXFwkJlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgYSA9IGEuam9pbihcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKGEgPSBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIihcIiArIHQuZGlnaXQgKyBcIiguKlwiICsgdC5kaWdpdCArIFwiKT8pXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIoJDEpP1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAodC5kaWdpdCwgXCJnXCIpLCB0LnBhdHRlcm4pKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZXN0cm95RXZlbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGIub2ZmKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnB1dCBrZXlkb3duIGtleXVwIHBhc3RlIGRyb3AgYmx1ciBmb2N1c291dCBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIiBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuam9pbihcIi5tYXNrIFwiKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdmFsOiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYyA9IGIuaXMoXCJpbnB1dFwiKSA/IFwidmFsXCIgOiBcInRleHRcIjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKDAgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYltjXSgpICE9PSBhKSBiW2NdKGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBjID0gYltjXSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNhbGN1bGF0ZUNhcmV0UG9zaXRpb246IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkID0gYy5nZXRNYXNrZWQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPSBjLmdldENhcmV0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhICE9PSBkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGIuZGF0YShcIm1hc2stcHJldml1cy1jYXJldC1wb3NcIikgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQgPSBkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnID0gYS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IChhID0gMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbCA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgayA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobSA9IGg7IG0gPCBkICYmIGMubWFza0RpZ2l0UG9zTWFwW21dOyBtKyspIGYrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobSA9IGggLSAxOyAwIDw9IG0gJiYgYy5tYXNrRGlnaXRQb3NNYXBbbV07IG0tLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKG0gPSBoIC0gMTsgMCA8PSBtOyBtLS0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5tYXNrRGlnaXRQb3NNYXBbbV0gJiYgbCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChtID0gZSAtIDE7IDAgPD0gbTsgbS0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubWFza0RpZ2l0UG9zTWFwT2xkW21dICYmIGsrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPiBnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoaCA9IDEwICogZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGUgPj0gaCAmJiBlICE9PSBnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBjLm1hc2tEaWdpdFBvc01hcE9sZFtoXSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChlID0gaCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoaCA9IGggLSAoayAtIGwpIC0gYSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLm1hc2tEaWdpdFBvc01hcFtoXSAmJiAoaCA9IGUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogaCA+IGUgJiYgKGggPSBoICsgKGwgLSBrKSArIGYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYmVoYXZpb3VyOiBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICBkID0gZCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGMuaW52YWxpZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9IGIuZGF0YShcIm1hc2sta2V5Y29kZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0xID09PSBhLmluQXJyYXkoZSwgbC5ieVBhc3NLZXlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IGMuZ2V0TWFza2VkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IGMuZ2V0Q2FyZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnID0gYi5kYXRhKFwibWFzay1wcmV2aXVzLXZhbHVlXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLnNldENhcmV0KGMuY2FsY3VsYXRlQ2FyZXRQb3NpdGlvbihnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBhLmpNYXNrR2xvYmFscy5rZXlTdHJva2VDb21wZW5zYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYy52YWwoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLnNldENhcmV0KGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMuY2FsbGJhY2tzKGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRNYXNrZWQ6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoID0gW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gdm9pZCAwID09PSBiID8gYy52YWwoKSA6IGIgKyBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gZC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBuID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHAgPSBmLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gPSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgciA9IFwicHVzaFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgdyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUucmV2ZXJzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgciA9IFwidW5zaGlmdFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IGsgLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgbiA9IHAgLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIEEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xIDwgZyAmJiAtMSA8IG47XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICh4ID0gayAtIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChBID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZyA8IGsgJiYgbiA8IHA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHo7IEEoKTsgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeSA9IGQuY2hhckF0KGcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBmLmNoYXJBdChuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxID0gbC50cmFuc2xhdGlvblt5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYubWF0Y2gocS5wYXR0ZXJuKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChoW3JdKHYpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEucmVjdXJzaXZlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgtMSA9PT0gdVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAodSA9IGcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGcgPT09IHggJiYgZyAhPT0gdSAmJiAoZyA9IHUgLSBtKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeCA9PT0gdSAmJiAoZyAtPSBtKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGcgKz0gbSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdiA9PT0gelxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICh3LS0sICh6ID0gdm9pZCAwKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBxLm9wdGlvbmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKChnICs9IG0pLCAobiAtPSBtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBxLmZhbGxiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKGhbcl0ocS5mYWxsYmFjayksIChnICs9IG0pLCAobiAtPSBtKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBjLmludmFsaWQucHVzaCh7IHA6IG4sIHY6IHYsIGU6IHEucGF0dGVybiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG4gKz0gbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWEpIGhbcl0oeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9PT0geVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IChiLnB1c2gobiksIChuICs9IG0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICgoeiA9IHkpLCBiLnB1c2gobiArIHcpLCB3KyspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcgKz0gbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhID0gZC5jaGFyQXQoeCk7XG4gICAgICAgICAgICAgICAgICAgIGsgIT09IHAgKyAxIHx8IGwudHJhbnNsYXRpb25bYV0gfHwgaC5wdXNoKGEpO1xuICAgICAgICAgICAgICAgICAgICBoID0gaC5qb2luKFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBjLm1hcE1hc2tkaWdpdFBvc2l0aW9ucyhoLCBiLCBwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGg7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBtYXBNYXNrZGlnaXRQb3NpdGlvbnM6IGZ1bmN0aW9uIChhLCBiLCBkKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSBlLnJldmVyc2UgPyBhLmxlbmd0aCAtIGQgOiAwO1xuICAgICAgICAgICAgICAgICAgICBjLm1hc2tEaWdpdFBvc01hcCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGQgPSAwOyBkIDwgYi5sZW5ndGg7IGQrKylcbiAgICAgICAgICAgICAgICAgICAgICAgIGMubWFza0RpZ2l0UG9zTWFwW2JbZF0gKyBhXSA9IDE7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjYWxsYmFja3M6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBnID0gYy52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPSBnICE9PSBmLFxuICAgICAgICAgICAgICAgICAgICAgICAgayA9IFtnLCBhLCBiLCBlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIGVbYV0gJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlW2FdLmFwcGx5KHRoaXMsIGMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgbChcIm9uQ2hhbmdlXCIsICEwID09PSBoLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgbChcIm9uS2V5UHJlc3NcIiwgITAgPT09IGgsIGspO1xuICAgICAgICAgICAgICAgICAgICBsKFwib25Db21wbGV0ZVwiLCBnLmxlbmd0aCA9PT0gZC5sZW5ndGgsIGspO1xuICAgICAgICAgICAgICAgICAgICBsKFwib25JbnZhbGlkXCIsIDAgPCBjLmludmFsaWQubGVuZ3RoLCBbXG4gICAgICAgICAgICAgICAgICAgICAgICBnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjLmludmFsaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGIgPSBhKGIpO1xuICAgICAgICAgICAgdmFyIGwgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGYgPSBjLnZhbCgpLFxuICAgICAgICAgICAgICAgIGs7XG4gICAgICAgICAgICBkID0gXCJmdW5jdGlvblwiID09PSB0eXBlb2YgZCA/IGQoYy52YWwoKSwgdm9pZCAwLCBiLCBlKSA6IGQ7XG4gICAgICAgICAgICBsLm1hc2sgPSBkO1xuICAgICAgICAgICAgbC5vcHRpb25zID0gZTtcbiAgICAgICAgICAgIGwucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gYy5nZXRDYXJldCgpO1xuICAgICAgICAgICAgICAgIGwub3B0aW9ucy5wbGFjZWhvbGRlciAmJiBiLnJlbW92ZUF0dHIoXCJwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgICAgICBiLmRhdGEoXCJtYXNrLW1heGxlbmd0aFwiKSAmJiBiLnJlbW92ZUF0dHIoXCJtYXhsZW5ndGhcIik7XG4gICAgICAgICAgICAgICAgYy5kZXN0cm95RXZlbnRzKCk7XG4gICAgICAgICAgICAgICAgYy52YWwobC5nZXRDbGVhblZhbCgpKTtcbiAgICAgICAgICAgICAgICBjLnNldENhcmV0KGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiBiO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGwuZ2V0Q2xlYW5WYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGMuZ2V0TWFza2VkKCEwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsLmdldE1hc2tlZFZhbCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGMuZ2V0TWFza2VkKCExLCBhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsLmluaXQgPSBmdW5jdGlvbiAoZykge1xuICAgICAgICAgICAgICAgIGcgPSBnIHx8ICExO1xuICAgICAgICAgICAgICAgIGUgPSBlIHx8IHt9O1xuICAgICAgICAgICAgICAgIGwuY2xlYXJJZk5vdE1hdGNoID0gYS5qTWFza0dsb2JhbHMuY2xlYXJJZk5vdE1hdGNoO1xuICAgICAgICAgICAgICAgIGwuYnlQYXNzS2V5cyA9IGEuak1hc2tHbG9iYWxzLmJ5UGFzc0tleXM7XG4gICAgICAgICAgICAgICAgbC50cmFuc2xhdGlvbiA9IGEuZXh0ZW5kKFxuICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgYS5qTWFza0dsb2JhbHMudHJhbnNsYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGUudHJhbnNsYXRpb25cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGwgPSBhLmV4dGVuZCghMCwge30sIGwsIGUpO1xuICAgICAgICAgICAgICAgIGsgPSBjLmdldFJlZ2V4TWFzaygpO1xuICAgICAgICAgICAgICAgIGlmIChnKSBjLmV2ZW50cygpLCBjLnZhbChjLmdldE1hc2tlZCgpKTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wbGFjZWhvbGRlciAmJiBiLmF0dHIoXCJwbGFjZWhvbGRlclwiLCBlLnBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgYi5kYXRhKFwibWFza1wiKSAmJiBiLmF0dHIoXCJhdXRvY29tcGxldGVcIiwgXCJvZmZcIik7XG4gICAgICAgICAgICAgICAgICAgIGcgPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBmID0gITA7IGcgPCBkLmxlbmd0aDsgZysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IGwudHJhbnNsYXRpb25bZC5jaGFyQXQoZyldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGggJiYgaC5yZWN1cnNpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gITE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwibWF4bGVuZ3RoXCIsIGQubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKFwibWFzay1tYXhsZW5ndGhcIiwgITApO1xuICAgICAgICAgICAgICAgICAgICBjLmRlc3Ryb3lFdmVudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgYy5ldmVudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgZyA9IGMuZ2V0Q2FyZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgYy52YWwoYy5nZXRNYXNrZWQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGMuc2V0Q2FyZXQoZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGwuaW5pdCghYi5pcyhcImlucHV0XCIpKTtcbiAgICAgICAgfTtcbiAgICAgICAgYS5tYXNrV2F0Y2hlcnMgPSB7fTtcbiAgICAgICAgdmFyIGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSBhKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBkID0ge30sXG4gICAgICAgICAgICAgICAgICAgIGUgPSBiLmF0dHIoXCJkYXRhLW1hc2tcIik7XG4gICAgICAgICAgICAgICAgYi5hdHRyKFwiZGF0YS1tYXNrLXJldmVyc2VcIikgJiYgKGQucmV2ZXJzZSA9ICEwKTtcbiAgICAgICAgICAgICAgICBiLmF0dHIoXCJkYXRhLW1hc2stY2xlYXJpZm5vdG1hdGNoXCIpICYmIChkLmNsZWFySWZOb3RNYXRjaCA9ICEwKTtcbiAgICAgICAgICAgICAgICBcInRydWVcIiA9PT0gYi5hdHRyKFwiZGF0YS1tYXNrLXNlbGVjdG9uZm9jdXNcIikgJiZcbiAgICAgICAgICAgICAgICAgICAgKGQuc2VsZWN0T25Gb2N1cyA9ICEwKTtcbiAgICAgICAgICAgICAgICBpZiAocChiLCBlLCBkKSkgcmV0dXJuIGIuZGF0YShcIm1hc2tcIiwgbmV3IG4odGhpcywgZSwgZCkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHAgPSBmdW5jdGlvbiAoYiwgZCwgZSkge1xuICAgICAgICAgICAgICAgIGUgPSBlIHx8IHt9O1xuICAgICAgICAgICAgICAgIHZhciBjID0gYShiKS5kYXRhKFwibWFza1wiKSxcbiAgICAgICAgICAgICAgICAgICAgZiA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgICAgICAgICAgIGIgPSBhKGIpLnZhbCgpIHx8IGEoYikudGV4dCgpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBkICYmIChkID0gZChiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm9iamVjdFwiICE9PSB0eXBlb2YgYyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGYoYy5vcHRpb25zKSAhPT0gZihlKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubWFzayAhPT0gZFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKHcpIHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgayA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGEgPSBcIm9uXCIgKyBhO1xuICAgICAgICAgICAgICAgIHZhciBlID0gYSBpbiBiO1xuICAgICAgICAgICAgICAgIGUgfHxcbiAgICAgICAgICAgICAgICAgICAgKGIuc2V0QXR0cmlidXRlKGEsIFwicmV0dXJuO1wiKSxcbiAgICAgICAgICAgICAgICAgICAgKGUgPSBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBiW2FdKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgICB9O1xuICAgICAgICBhLmZuLm1hc2sgPSBmdW5jdGlvbiAoYiwgZCkge1xuICAgICAgICAgICAgZCA9IGQgfHwge307XG4gICAgICAgICAgICB2YXIgZSA9IHRoaXMuc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgYyA9IGEuak1hc2tHbG9iYWxzLFxuICAgICAgICAgICAgICAgIGYgPSBjLndhdGNoSW50ZXJ2YWw7XG4gICAgICAgICAgICBjID0gZC53YXRjaElucHV0cyB8fCBjLndhdGNoSW5wdXRzO1xuICAgICAgICAgICAgdmFyIGsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHAodGhpcywgYiwgZCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhKHRoaXMpLmRhdGEoXCJtYXNrXCIsIG5ldyBuKHRoaXMsIGIsIGQpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhKHRoaXMpLmVhY2goayk7XG4gICAgICAgICAgICBlICYmXG4gICAgICAgICAgICAgICAgXCJcIiAhPT0gZSAmJlxuICAgICAgICAgICAgICAgIGMgJiZcbiAgICAgICAgICAgICAgICAoY2xlYXJJbnRlcnZhbChhLm1hc2tXYXRjaGVyc1tlXSksXG4gICAgICAgICAgICAgICAgKGEubWFza1dhdGNoZXJzW2VdID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBhKGRvY3VtZW50KS5maW5kKGUpLmVhY2goayk7XG4gICAgICAgICAgICAgICAgfSwgZikpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgICAgICBhLmZuLm1hc2tlZCA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhKFwibWFza1wiKS5nZXRNYXNrZWRWYWwoYSk7XG4gICAgICAgIH07XG4gICAgICAgIGEuZm4udW5tYXNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChhLm1hc2tXYXRjaGVyc1t0aGlzLnNlbGVjdG9yXSk7XG4gICAgICAgICAgICBkZWxldGUgYS5tYXNrV2F0Y2hlcnNbdGhpcy5zZWxlY3Rvcl07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IGEodGhpcykuZGF0YShcIm1hc2tcIik7XG4gICAgICAgICAgICAgICAgYiAmJiBiLnJlbW92ZSgpLnJlbW92ZURhdGEoXCJtYXNrXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGEuZm4uY2xlYW5WYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhKFwibWFza1wiKS5nZXRDbGVhblZhbCgpO1xuICAgICAgICB9O1xuICAgICAgICBhLmFwcGx5RGF0YU1hc2sgPSBmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgYiA9IGIgfHwgYS5qTWFza0dsb2JhbHMubWFza0VsZW1lbnRzO1xuICAgICAgICAgICAgKGIgaW5zdGFuY2VvZiBhID8gYiA6IGEoYikpXG4gICAgICAgICAgICAgICAgLmZpbHRlcihhLmpNYXNrR2xvYmFscy5kYXRhTWFza0F0dHIpXG4gICAgICAgICAgICAgICAgLmVhY2goZik7XG4gICAgICAgIH07XG4gICAgICAgIGsgPSB7XG4gICAgICAgICAgICBtYXNrRWxlbWVudHM6IFwiaW5wdXQsdGQsc3BhbixkaXZcIixcbiAgICAgICAgICAgIGRhdGFNYXNrQXR0cjogXCIqW2RhdGEtbWFza11cIixcbiAgICAgICAgICAgIGRhdGFNYXNrOiAhMCxcbiAgICAgICAgICAgIHdhdGNoSW50ZXJ2YWw6IDMwMCxcbiAgICAgICAgICAgIHdhdGNoSW5wdXRzOiAhMCxcbiAgICAgICAgICAgIGtleVN0cm9rZUNvbXBlbnNhdGlvbjogMTAsXG4gICAgICAgICAgICB1c2VJbnB1dDpcbiAgICAgICAgICAgICAgICAhL0Nocm9tZVxcL1syLTRdWzAtOV18U2Ftc3VuZ0Jyb3dzZXIvLnRlc3QoXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgICAgICAgICAgICAgKSAmJiBrKFwiaW5wdXRcIiksXG4gICAgICAgICAgICB3YXRjaERhdGFNYXNrOiAhMSxcbiAgICAgICAgICAgIGJ5UGFzc0tleXM6IFs5LCAxNiwgMTcsIDE4LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDkxXSxcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uOiB7XG4gICAgICAgICAgICAgICAgMDogeyBwYXR0ZXJuOiAvXFxkLyB9LFxuICAgICAgICAgICAgICAgIDk6IHsgcGF0dGVybjogL1xcZC8sIG9wdGlvbmFsOiAhMCB9LFxuICAgICAgICAgICAgICAgIFwiI1wiOiB7IHBhdHRlcm46IC9cXGQvLCByZWN1cnNpdmU6ICEwIH0sXG4gICAgICAgICAgICAgICAgQTogeyBwYXR0ZXJuOiAvW2EtekEtWjAtOV0vIH0sXG4gICAgICAgICAgICAgICAgUzogeyBwYXR0ZXJuOiAvW2EtekEtWl0vIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBhLmpNYXNrR2xvYmFscyA9IGEuak1hc2tHbG9iYWxzIHx8IHt9O1xuICAgICAgICBrID0gYS5qTWFza0dsb2JhbHMgPSBhLmV4dGVuZCghMCwge30sIGssIGEuak1hc2tHbG9iYWxzKTtcbiAgICAgICAgay5kYXRhTWFzayAmJiBhLmFwcGx5RGF0YU1hc2soKTtcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYS5qTWFza0dsb2JhbHMud2F0Y2hEYXRhTWFzayAmJiBhLmFwcGx5RGF0YU1hc2soKTtcbiAgICAgICAgfSwgay53YXRjaEludGVydmFsKTtcbiAgICB9LFxuICAgIHdpbmRvdy5qUXVlcnksXG4gICAgd2luZG93LlplcHRvXG4pO1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUV4ZW1wbGUge1xuICAgIC8vZXNzZSBlaCB1bSBleGVtcGxvIGRlIHNlcnZpY2VcbiAgICAvL2Vzc2Egcm90YSwgZWggdW0gZXhlbXBsbyBkZSByb3RhIGRlY2xhcmFkYSBkZW50cm8gZG8gc2VydmljZSBub2RlXG4gICAgLy9vcyBzZXJ2aWNlcyBzZXJ2ZW0gcGFyYSBjb25zdW1pciBhcGlzIGUgYXBpcyBwcml2YWRhc1xuICAgIGFzeW5jIGdldEFsbEluZm9DbGllbnQoaWQpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgYC9jbGllbnRhcGkvZ2V0SW5mb0NsaWVudC8ke2lkfWAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gZGF0YS5qc29uKCk7XG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0galF1ZXJ5OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIjtcbmltcG9ydCBFeGVtcGxlIGZyb20gXCIuL2NvbXBvbmVudHMvRXhlbXBsZS5qc1wiO1xuaW1wb3J0IENvZGVTZWxsZXIgZnJvbSBcIi4vY29tcG9uZW50cy9Db2RlU2VsbGVyLmpzXCI7XG5pbXBvcnQgXCIuL2xpYi9qcXVlcnkubWFzay5taW4uanNcIjtcbmltcG9ydCBwcmljZU1ldGVyUHJvbW90aW9uIGZyb20gXCIuL2NvbXBvbmVudHMvcHJpY2VNZXRlclByb21vdGlvbi5qc1wiO1xuXG5jbGFzcyBDaGVja291dCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIG5ldyBFeGVtcGxlKCk7XG4gICAgICAgIG5ldyBDb2RlU2VsbGVyKCk7XG4gICAgICAgIG5ldyBwcmljZU1ldGVyUHJvbW90aW9uKCk7XG4gICAgICAgIC8vIG5ldyBXYXJlaG91c2VWYWxpZGF0aW9uKCk7XG4gICAgICAgIC8vIG5ldyBTYWxlc21hbkNvZGUoKTtcbiAgICB9XG59XG5cbm5ldyBDaGVja291dCgpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgc2NyaXB0LmRlZmVyID0gdHJ1ZTtcbiAgICBzY3JpcHQuc3JjID0gXCIvL3N1aXRlLmxpbnhpbXB1bHNlLm5ldC9pbXB1bHNlL2ltcHVsc2UuanNcIjtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKFwiZGF0YS1hcGlrZXlcIiwgXCJwYWRvdmFuaVwiKTtcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59KSgpO1xuXG5jb25zb2xlLmxvZygnY3VzdG9tIGNoZWNrb3V0IDEuMC4zIHBheW1lZScpOyAgXG4hZnVuY3Rpb24odCxlLGkpe1xuICAgIHZhciByPXQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxcbiAgICBzPXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xuICAgIHIudHlwZT1cInRleHQvamF2YXNjcmlwdFwiLFxuICAgIHIuc3JjPVwiaHR0cHM6Ly9wcHB2dGV4LnBheW1lZS5jb20uYnIvcGF5bWVlLnBhcmNlbGFkby52dGV4LmpzP1wiK25ldyBEYXRlKCkuZ2V0TWlsbGlzZWNvbmRzKCksXG4gICAgci5pZD1cInBheW1lZUluc3RhbGxtZW50XCIscy5hcHBlbmRDaGlsZChyKTtcbn0oZG9jdW1lbnQpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
