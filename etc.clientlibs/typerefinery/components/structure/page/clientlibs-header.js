/* clientlib source: /apps/typerefinery/components/structure/page/clientlibs-header/functions.js */
window.Typerefinery = window.Typerefinery || {};
window.Typerefinery.Components = Typerefinery.Components || {};
window.Typerefinery.Page = Typerefinery.Page || {};
window.Typerefinery.Page.Theme = Typerefinery.Page.Theme || {};
window.Typerefinery.Page.Tms = Typerefinery.Page.Tms || {};


(function (ns, themeNs, tmsNs, document, window) {

    "use strict";
    ns.init = () => {
        tmsNs.init();
        // Commenting this because themeNs init is invoked if the theme Button is linked to the page.
        // themeNs.init();
    };

    $(document).ready(function () {
        ns.init();
    });
})(Typerefinery.Page, Typerefinery.Page.Theme, Typerefinery.Page.Tms, document, window);
/* clientlib source: /apps/typerefinery/components/structure/page/clientlibs-header/theme/functions.js */
window.Typerefinery = window.Typerefinery || {};
window.Typerefinery.Components = Typerefinery.Components || {};
window.Typerefinery.Page = Typerefinery.Page || {};
window.Typerefinery.Page.Theme = Typerefinery.Page.Theme || {};
window.Typerefinery.Components.Widgets = Typerefinery.Components.Widgets || {};
window.Typerefinery.Components.Widgets.Chart = Typerefinery.Components.Widgets.Chart || {};
window.Typerefinery.Components.Widgets.Chart.Instances = Typerefinery.Components.Widgets.
  Chart.Instances || {};

(function (ns, chartInstances, document, window) {
  "use strict";

  ns.toggleTheme = () => {
    const currentPageTheme = localStorage.getItem("pageTheme") || "light";
    const newTheme = currentPageTheme == "light" ? "dark" : "light";
    const $body = document.getElementsByTagName("body")[0];

    if ($body) {
      $body.classList.remove(`bg-${currentPageTheme}`);
      $body.classList.add(`bg-${newTheme}`);
    }

    //to change the background of component
    const toggleTheme = document.querySelectorAll(`[toggleTheme]`);
    toggleTheme.forEach(function ($component) {

      const toggle = $component.getAttribute("toggleTheme");


      const $body = document.getElementsByTagName("body")[0];

      if (newTheme === "light") {
        $body.classList.add("bg-light");
      } else if (newTheme === "dark") {
        $body.classList.add("bg-dark");
      }

      if (newTheme === 'dark') {
        if (toggle === "text") {
          $component.classList.remove("text-dark");
          $component.classList.add("text-white");
        } else if(toggle === "component") {
          $component.classList.remove("bg-light", "shadow-lg");
          $component.classList.add("bg-dark", "shadow-lg");
        
        }else if (toggle === "true") {
          $component.classList.remove("bg-light", "shadow-lg", "text-dark");
          $component.classList.add("bg-dark", "shadow-lg", "text-white");
        }

      }
      else {
        if (toggle === "text") {
          $component.classList.remove("text-white");
          $component.classList.add("text-dark");
        } else if (toggle === "true") {
          $component.classList.remove("bg-dark", "shadow-lg", "text-white");
          $component.classList.add("bg-light", "shadow-lg", "text-dark");
        }
      }
    });

    
    ns.updateATagColor(newTheme);
    

    setTimeout(() => {
      Object.entries(chartInstances)?.forEach(($chart) => {
        const gridAxisToBeValidated = ["x", "y", "r"];

        // TODO: Need to be as a separate ns.
        var chartObj = {};

        // to update the grid lines
        gridAxisToBeValidated.forEach((axis) => {
          if ($chart[1].options.scales[axis]) {
            chartObj = {
              [axis]: {
                grid: {
                  color: ns.getColor(newTheme, "grid"),
                },
              },
            };
          }
        });

        $chart[1].options.scales = chartObj;

        // to update background color of a chart legend.
        $chart[1].options.plugins.legend.labels = {
          color: ns.getColor(newTheme, "legend"),
        };
        // to update background color of a chart canvas.
        $chart[1].options.plugins.customCanvasBackgroundColor = {
          color: ns.getColor(newTheme, "background"),
        };
        $chart[1].update();
      });
    }, 1);

    localStorage.setItem("pageTheme", newTheme);
  };

  ns.updateATagColor = (theme) => {
    const $aTags = document.querySelectorAll("a");
    $aTags.forEach(($aTag) => {
      if (theme === "dark") {
        $aTag.classList.remove("text-dark");
        $aTag.classList.add("text-white");
      } else {
        $aTag.classList.remove("text-white");
        $aTag.classList.add("text-dark");
      }
    });
  };


  ns.getColor = (theme, type) => {
    return type === "grid"
      ? theme === "dark"
        ? "#f8f9fa"
        : "#dee2e6"
      : type === "background"
        ? theme === "light"
          ? "#f8f9fa"
          : "#4f4f4f"
        : type === "legend"
          ? theme === "light"
            ? "#343a40"
            : "#f8f9fa"
          : null;
  };

  ns.setInitialTheme = (componentConfig) => {
    if (!componentConfig || !componentConfig.toggleTheme) return;
    const initialTheme = componentConfig.toggleTheme;
    localStorage.setItem("pageTheme", initialTheme === "dark" ? "light" : "dark");
    ns.toggleTheme();
  };

  ns.attachEventListener = ($component, componentConfig) => {
    // Event Listener for toggle theme (dark | light);
    $($component).on("click", ns.toggleTheme);
  };

  ns.init = ($component, componentConfig) => {
    ns.setInitialTheme(componentConfig);
    ns.attachEventListener($component, componentConfig);
  };
})(Typerefinery.Page.Theme, Typerefinery.Components.Widgets.Chart.Instances, document, window);

/* clientlib source: /apps/typerefinery/components/structure/page/clientlibs-header/tms/client.js */

console.log("client.js loaded")

window.MessageService = {}
// eslint-disable-next-line no-undef
window.MessageService.Config = MessageService.Config || {}
// eslint-disable-next-line no-undef
window.MessageService.Client = MessageService.Client || {}
  ; (function (ns, JSONSchemas, document, window) {
    ns.publishers = {}
    ns.subscribers = {}
    ns.callbacks = {}
    ns.metaReady = false
    ns.dataToSend = []
    ns.callTimeout = 10000
    ns.meta = undefined
    ns.events = {
      READY: "messageservice:ready",
      CLIENT_ID: "messageservice:clientid",
      MESSAGE: "messageservice:message",
      ERROR: "messageservice:error",
      emit: function (eventName, data) {
        if (eventName && document?.body) {
          document?.body?.dispatchEvent(
            new CustomEvent(eventName, {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: data || {},
            })
          )
        } else {
        }
      },
    }

    function init() {
      ns.client_id = Date.now()

      // output id to page
      ns.events.emit(ns.events.CLIENT_ID, ns.client_id)
    }

    //get metadata field messagehost
    ns.connect = function (host, callback) {
      if (typeof host !== "string") {
        ns.events.emit(ns.events.ERROR, `host "${host}" is not a string.`)
        return
      }
      ns.ws = new WebSocket(host)

      ns.ws.onopen = function (e) {
        ns.logMessage("[open] Connection established cms")
      }
      ns.ws.onerror = function (error) {
        var message = JSON.stringify(error)
        ns.logMessage(`[error] ${message}`)
      }
      ns.ws.onmessage = function (event) {
        var message = JSON.parse(event.data)
        var messageType = message.type
        if (messageType === "call") {
          var messageId = message.id
          var callbackId = message.callbackid
          let callback = ns.callbacks[callbackId]
          if (callbackId && callback) {
            callback.callback(
              message.error ? message.data : null,
              message.success ? message.data : null
            )
            if (callback.timeout) {
              clearTimeout(callback.timeout)
            }
            delete ns.callbacks[callbackId]
          }
        } else if (
          messageType === "publish" &&
          ns.subscribers[messageId] &&
          ns.publishers[messageId]
        ) {
          // TODO: handle publish - send message to server
          var publisherSchema = ns.publishers[messageId]
          var err = []
          var data = JSONSchemas.transform(
            publisherSchema,
            err,
            message.data,
            true
          )
          if (data) {
            for (var fn of ns.subscribers[messageId]) {
              fn(data)
            }
          }
        } else if (messageType === "meta") {
          ns.meta = message
          ns.publishers = {}
          //get list of pubishers schema from metadata
          for (var item of message.publish) {
            ns.publishers[item.id] = item.schema
          }
          //sync subscribers
          ns.syncSubscribers()
          ns.metaReady = true
          // call connect callback with websocket and metadata
          if (callback) {
            setTimeout(callback, 0)
          }
          ns.events.emit(ns.events.READY, message)
        }
        ns.logMessage(message)
      }
    }

    ns.logMessage = function (text) {
      ns.events.emit(ns.events.MESSAGE, text)
    }

    ns.isReady = function () {
      return ns.ws.readyState === WebSocket.OPEN && ns.metaReady
    }

    ns.startSendDataTimeout = function () {
      ns.sendDataTimeout = setTimeout(ns.sendData, 50, null)
    }
    ns.clearSendDataTimeout = function () {
      if (ns.sendDataTimeout) {
        clearTimeout(ns.sendDataTimeout)
        ns.sendDataTimeout = null
      }
    }

    ns.call = function (name, data, callback, timeout) {
      if (callback) {
        ns.sendCall(name, data, callback, timeout)
      } else {
        return new Promise(function (resolve, reject) {
          ns.sendCall(name, data, function (err, data) {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        })
      }
    }

    ns.timeoutHandler = function (callbackId) {
      var callback = ns.callbacks[callbackId]
      if (callback) {
        callback.callback("Timeout")
        delete ns.callbacks[callbackId]
      }
    }

    ns.sendCall = function (name, data, callback, timeout) {
      if (ns.isReady()) {
        var callbackId = Date.now()
        ns.callbacks[callbackId] = {
          callback: callback,
          timeout: setTimeout(
            ns.timeoutHandler,
            timeout || ns.callTimeout,
            callbackId + ""
          ),
        }
        ns.sendData(
          JSON.stringify({
            type: "call",
            id: name,
            data: data,
            callbackid: callbackId,
          })
        )
      } else {
        callback("Not connected")
      }
    }

    ns.sendData = function (data, force) {
      if (ns.isReady() || force) {
        if (data === null && ns.dataToSend.length > 0) {
          ns.ws.send(ns.dataToSend.shift())
          ns.startSendDataTimeout()
        } else if (data !== null) {
          ns.ws.send(data)
        } else {
          ns.clearSendDataTimeout()
        }
      } else {
        ns.dataToSend.push(data)
      }
    }

    ns.startSyncSubscribersTimeout = function () {
      ns.syncSubscribersTimeout = setTimeout(ns.syncSubscribers, 50, true)
    }
    ns.clearSyncSubscribersTimeout = function () {
      if (ns.syncSubscribersTimeout) {
        clearTimeout(ns.syncSubscribersTimeout)
        ns.syncSubscribersTimeout = null
      }
    }

    //send data to server
    ns.publish = function (name, data) {
      ns.sendData(JSON.stringify({ type: "subscribe", id: name, data: data }))
    }
    //subscribe to data from server
    ns.subscribe = function (name, callback) {
      ns.clearSyncSubscribersTimeout()
      ns.startSyncSubscribersTimeout()
      if (ns.subscribers[name]) {
        ns.subscribers[name].push(callback)
      } else {
        ns.subscribers[name] = [callback]
      }
    }

    ns.syncSubscribers = function (force) {
      ns.clearSyncSubscribersTimeout()
      var keys = Object.keys(ns.subscribers)
      if (force || keys.length) {
        ns.sendData(
          JSON.stringify({ type: "subscribers", subscribers: keys }),
          force
        )
      } else {
        ns.sendData(JSON.stringify({ type: "subscribers", subscribers: [] }))
      }
    }

    init()
  })(window.MessageService.Client, window.JSONSchemas, document, window)
/* clientlib source: /apps/typerefinery/components/structure/page/clientlibs-header/tms/jsonschema.js */
$(document).ready(function (e) {
window.JSONSchemas = {}
;(function (ns) {
  ns.REG_NUMBER = /[\d,\\.]+/g
  ns.jsonschemas = {}
  ns.SchemaValue = function () {
    return {}
  }

  ns.check_string = function (meta, error, value, errplus) {
    var type = typeof val
    if (type !== "string") value = value ? value + "" : null

    if (errplus == null) errplus = ""

    if (value) {
      switch (meta.subtype) {
        case "name":
          value = value.toName()
          break
      }
    }

    if (meta.$$REQUIRED && !value) {
      error.push(errplus + meta.$$ID + ".required")
      return
    }

    if (value == null) return

    var len = value.length

    if (meta.maxLength && len > meta.maxLength) {
      error.push(errplus + meta.$$ID + ".maxlength")
      return
    }

    if (meta.minLength && len < meta.minLength) {
      error.push(errplus + meta.$$ID + ".minlength")
      return
    }

    if (value) {
      switch (meta.subtype) {
        case "email":
          value = value.replace(/\s/g, "").toLowerCase()
          if (!value.isEmail()) {
            error.push(errplus + meta.$$ID + ".invalid")
            return
          }
          break
        case "phone":
          value = value.replace(/\s/g, "").toLowerCase()
          if (!value.isPhone()) {
            error.push(errplus + meta.$$ID + ".invalid")
            return
          }
          break
        case "url":
          if (!value.isURL()) {
            error.push(errplus + meta.$$ID + ".invalid")
            return
          }
          break
        case "zip":
          if (!value.isZIP()) {
            error.push(errplus + meta.$$ID + ".invalid")
            return
          }
          break
        case "guid":
          if (!value.isGUID()) {
            error.push(errplus + meta.$$ID + ".invalid")
            return
          }
          break
        case "uid":
          if (!value.isUID()) {
            error.push(errplus + meta.$$ID + ".invalid")
            return
          }
          break
        case "json":
          if (!value.isJSON()) {
            error.push(errplus + meta.$$ID + ".invalid")
            return
          }
          break
        case "base64":
          if (!value.isBase64()) {
            error.push(errplus + meta.$$ID + ".invalid")
            return
          }
          break
        case "lowercase":
          value = value.toLowerCase()
          break
        case "uppercase":
          value = value.toUpperCase()
          break
        case "capitalize":
          value = value.capitalize()
          break
      }
    }

    if (meta.enum instanceof Array) {
      if (meta.enum.indexOf(value) === -1) {
        error.push(errplus + meta.$$ID + ".enum")
        return
      }
    }

    return value
  }

  ns.check_number = function (meta, error, value, errplus) {
    var type = typeof value

    if (errplus == null) errplus = ""

    if (type === "string") {
      if (ns.REG_NUMBER.test(value)) value = value.parseFloat()
      else value = null
    } else if (type !== "number") value = null

    if (meta.$$REQUIRED) {
      if (value == null) {
        error.push(errplus + meta.$$ID + ".required")
        return
      }
    }

    if (value == null) return

    if (meta.multipleOf) {
      if (value % meta.multipleOf !== 0) {
        error.push(errplus + meta.$$ID + ".multipleof")
        return
      }
    }

    if (meta.maximum) {
      if (value > meta.maximum) {
        error.push(errplus + meta.$$ID + ".maximum")
        return
      }
    }

    if (meta.exclusiveMaximum) {
      if (value >= meta.exclusiveMaximum) {
        error.push(errplus + meta.$$ID + ".exclusivemaximum")
        return
      }
    }

    if (meta.minimum) {
      if (value < meta.minimum) {
        error.push(errplus + meta.$$ID + ".minimum")
        return
      }
    }

    switch (meta.subtype) {
      case "smallint":
        if (value < -32767 || value > 32767) {
          error.push(errplus + meta.$$ID + ".invalid")
          return
        }
        break
      case "tinyint":
        if (value < 0 || value > 255) {
          error.push(errplus + meta.$$ID + ".invalid")
          return
        }
        break
    }

    if (meta.exclusiveMinimum) {
      if (value <= meta.exclusiveMinimum) {
        error.push(errplus + meta.$$ID + ".exclusiveminimum")
        return
      }
    }

    return value
  }

  ns.check_boolean = function (meta, error, value, errplus) {
    var type = typeof value
    if (type !== "boolean") value = value ? (value + "").parseBoolean() : null

    if (meta.$$REQUIRED) {
      if (errplus == null) errplus = ""

      if (value == null) {
        error.push(errplus + meta.$$ID + ".required")
        return
      }
    }

    if (value != null) return value
  }

  ns.check_date = function (meta, error, value, errplus) {
    if (!(value instanceof Date))
      value = value ? (value + "").parseDate() : null

    if (value && value instanceof Date && !(value.getTime() > 0)) value = null

    if (meta.$$REQUIRED) {
      if (errplus == null) errplus = ""

      if (value == null) {
        error.push(meta.$$ID + ".required")
        return
      }
    }

    if (value != null) return value
  }

  ns.read_def = function (ref, definitions) {
    if (ref[0] === "#") {
      var tmp = ref.substring(2).split("/")
      var def = definitions[tmp[0]]
      if (def) {
        var schema = tmp[1]
        var obj = def[schema]
        if (obj) {
          if (!obj.$$ID) obj.$$ID = schema
          return obj
        }
      }
    }
  }

  ns.check_array = function (meta, error, value, stop, definitions) {
    if (!(value instanceof Array)) {
      if (meta.$$REQUIRED) error.push(meta.$$ID + ".required")
      return
    }

    if (!value.length) {
      if (meta.$$REQUIRED) {
        error.push(meta.$$ID + ".required")
        return
      }
      return value
    }

    var response
    var tmp

    if (meta.items instanceof Array) {
      for (var i = 0; i < value.length; i++) {
        var val = value[i]
        var type = meta.items[i]

        if (type) {
          switch (type) {
            case "$ref":
              break
            case "number":
            case "integer":
            case "float":
            case "decimal":
              tmp = ns.check_number(type, error, val)
              if (tmp != null) {
                response.push(tmp)
                break
              } else {
                error.push(meta.$$ID + ".type")
                return
              }
            case "boolean":
            case "bool":
              tmp = ns.check_boolean(type, error, val)
              if (tmp != null) {
                response.push(tmp)
                break
              } else {
                error.push(meta.$$ID + ".type")
                return
              }
            case "date":
              tmp = ns.check_date(type, error, val)
              if (tmp != null) {
                response.push(tmp)
                break
              } else {
                error.push(meta.$$ID + ".type")
                return
              }
            case "object":
              tmp = ns.check_object(type, error, val, null, stop, definitions)
              if (tmp != null) {
                response.push(tmp)
                break
              } else {
                error.push(meta.$$ID + ".type")
                return
              }
            case "array":
              tmp = ns.check_array(type, error, value, null, definitions)
              if (
                tmp != null &&
                (!meta.uniqueItems || response.indexOf(tmp) === -1)
              ) {
                response.push(tmp)
                break
              } else {
                error.push(meta.$$ID + ".type")
                return
              }
            case "string":
            default:
              tmp = ns.check_string(type, error, val)
              if (tmp != null) {
                response.push(tmp)
                break
              } else {
                error.push(meta.$$ID + ".type")
                return
              }
          }
        } else if (!type && !meta.additionalItems) {
          error.push(meta.$$ID + ".additionalitems")
          return
        }
      }
    } else if (meta.items) {
      response = []

      for (let i = 0; i < value.length; i++) {
        let val = value[i]

        if (meta.items.$ref) {
          var ref = ns.read_def(meta.items.$ref, definitions)
          if (ref) {
            var newerror = []
            tmp = ns.transform(ref, newerror, val)
            if (newerror.length) {
              for (var err of newerror)
                error.push(ref.$$ID + "." + err, "@", null, i)
            } else if (
              tmp != null &&
              (!meta.uniqueItems || response.indexOf(tmp) === -1)
            )
              response.push(tmp)
            continue
          } else continue
        }

        switch (meta.items.type) {
          case "number":
          case "integer":
            tmp = ns.check_number(meta.items, error, val)
            if (
              tmp != null &&
              (!meta.uniqueItems || response.indexOf(tmp) === -1)
            )
              response.push(tmp)
            break
          case "boolean":
          case "bool":
            tmp = ns.check_boolean(meta.items, error, val)
            if (
              tmp != null &&
              (!meta.uniqueItems || response.indexOf(tmp) === -1)
            )
              response.push(tmp)
            break
          case "date":
            tmp = ns.check_date(meta.items, error, val)
            if (
              tmp != null &&
              (!meta.uniqueItems || response.indexOf(tmp) === -1)
            )
              response.push(tmp)
            break
          case "object":
            var newerrorObject = []
            tmp = ns.check_object(
              meta.items,
              newerrorObject,
              val,
              stop,
              definitions
            )
            if (newerrorObject.length) {
              for (let err of newerrorObject)
                error.push(meta.$$ID + "." + err.name, err.error, null, i)
            } else if (
              tmp != null &&
              (!meta.uniqueItems || response.indexOf(tmp) === -1)
            )
              response.push(tmp)
            break
          case "array":
            tmp = ns.check_array(meta.items, error, value, stop, definitions)
            if (
              tmp != null &&
              (!meta.uniqueItems || response.indexOf(tmp) === -1)
            )
              response.push(tmp)
            break
          case "string":
          default:
            tmp = ns.check_string(meta.items, error, val)
            if (
              tmp != null &&
              (!meta.uniqueItems || response.indexOf(tmp) === -1)
            )
              response.push(tmp)
            break
        }
      }
    } else response = meta.uniqueItems ? [...new Set(value)] : value

    if (!response.length && meta.$$REQUIRED) {
      error.push(meta.$$ID + ".required")
      return
    }

    if (meta.minItems && response.length < meta.minItems) {
      error.push(meta.$$ID + ".minitems")
      return
    }

    if (meta.maxItems && response.length < meta.maxItems) {
      error.push(meta.$$ID + ".maxitems")
      return
    }

    return response
  }

  ns.check_object = function (meta, error, value, response, stop, definitions) {
    if (!value || typeof value !== "object") {
      if (meta.$$REQUIRED) error.push(meta.$$ID + ".required")
      return
    }

    if (stop && error.items.length) return

    if (!response) response = new ns.SchemaValue()

    var count = 0
    var tmp

    for (var key in meta.properties) {
      var prop = meta.properties[key]

      if (!prop.ID) {
        prop.$$ID = key
        prop.$$REQUIRED = meta.required
          ? meta.required.indexOf(key) !== -1
          : false
      }

      if (stop && error.items.length) return

      if (meta.maxProperties && count > meta.maxProperties) {
        error.push(meta.$$ID + ".maxproperties")
        return
      }

      var val = value[key]

      switch (prop.type) {
        case "number":
        case "integer":
          tmp = ns.check_number(prop, error, val)
          if (tmp != null) {
            response[key] = tmp
            count++
          }
          break
        case "boolean":
        case "bool":
          tmp = ns.check_boolean(prop, error, val)
          if (tmp != null) {
            response[key] = tmp
            count++
          }
          break
        case "date":
          tmp = ns.check_date(prop, error, val)
          if (tmp != null) {
            response[key] = tmp
            count++
          }
          break
        case "string":
          tmp = ns.check_string(prop, error, val)
          if (tmp != null) {
            response[key] = tmp
            count++
          }
          break
        case "object":
          if (prop.properties) {
            tmp = ns.check_object(prop, error, val, null, null, definitions)
            if (tmp != null) {
              response[key] = tmp
              count++
            }
          } else {
            // check ref
            if (prop.$ref) {
              var ref = ns.read_def(prop.$ref, definitions)
              if (ref) {
                let newerror = []
                tmp = ns.transform(ref, newerror, val)
                if (newerror.items.length) {
                  for (var err of newerror.items)
                    error.push(ref.$$ID + "." + err, "@")
                } else response[key] = tmp
                continue
              } else continue
            }

            response[key] = val
            count++
          }
          break
        case "array":
          tmp = ns.check_array(prop, error, val, null, definitions)
          if (tmp != null) {
            response[key] = tmp
            count++
          }
          break
        default:
          if (prop.$ref) {
            let ref = ns.jsonschemas[prop.$ref]
            if (ref) {
              tmp = ns.check_object(ref, error, val, null, null, definitions)
              if (tmp != null) {
                response[key] = tmp
                count++
              } else if (prop.$$REQUIRED) error.push(prop.ID + ".required")
            } else error.push(prop.ID + ".reference")
          } else {
            // String
            tmp = ns.check_string(prop, error, val)
            if (tmp != null) {
              response[key] = tmp
              count++
            }
          }
          break
      }
    }

    if (meta.minProperties && count < meta.minProperties) {
      error.push(meta.$$ID + ".minproperties")
      return
    }

    if (count) return response
  }

  ns.transform = function (meta, error, value, stop) {
    var output

    switch (meta.type) {
      case "string":
        output = ns.check_string(meta, error, value)
        break
      case "number":
      case "integer":
      case "float":
      case "decimal":
        output = ns.check_number(meta, error, value)
        break
      case "boolean":
      case "bool":
        output = ns.check_boolean(meta, error, value)
        break
      case "date":
        output = ns.check_date(meta, error, value)
        break
      case "object":
        output = ns.check_object(meta, error, value, null, stop, meta)
        break
      case "array":
        output = ns.check_array(meta, error, value, stop, meta)
        break
      default:
        error.push(".type")
        return
    }

    if (stop && error.length) return

    return output || {}
  }

  ns.register = function (schema) {
    if (schema.$id) ns.jsonschemas[schema.$id] = schema
  }
})(window.JSONSchemas)
})

/* clientlib source: /apps/typerefinery/components/structure/page/clientlibs-header/tms/functions.js */
window.Typerefinery = window.Typerefinery || {};
window.Typerefinery.Components = Typerefinery.Components || {};
window.Typerefinery.Page = Typerefinery.Page || {};
window.Typerefinery.Page.Theme = Typerefinery.Page.Theme || {};
window.Typerefinery.Page.Tms = Typerefinery.Page.Tms || {};
window.MessageService = window.MessageService || {};
window.MessageService.Client = MessageService.Client || {};

(function (ns, clientNs, document, window) {
  "use strict";

  ns.registery = {};

  ns.persistData = (key, data) => {
     localStorage.setItem(key, data);
  };

  ns.hostAdded = (newHost) => {
    const listOfHost = JSON.parse(localStorage.getItem("tmsHost") || "[]");
    const filteredHost = listOfHost.filter((host) => host === newHost);
    if (filteredHost.length === 0) {
      listOfHost.push(newHost);
      localStorage.setItem("tmsHost", JSON.stringify(listOfHost));
    }
  };


  ns.registerToTms = (host, topic, key, callbackFn) => {
    ns.hostAdded(host);
    ns.registery[host] = ns.registery[host] || {};
    ns.registery[host][topic] = ns.registery[host][topic] || {};
    ns.registery[host][topic] = callbackFn;
    ns.registery[host][topic][key] = callbackFn;
  };

  ns.connect = () => {
    const listOfHost = JSON.parse(localStorage.getItem("tmsHost") || "[]");

    function payload_insert(data) {
      console.log(
        "--------------------------Payload Inserted ------------------------"
      );
    }

    listOfHost.forEach((host) => {
      try {
        // connect to websocket
        clientNs?.connect(host, function () {
          clientNs?.subscribe("payload_insert", payload_insert);
        });
      } catch (error) {
        console.error(error);
      }
    });

    // listen to messages.
    window.addEventListener(clientNs?.events.MESSAGE, function (message) {
      console.log(["tms message", message]);
      let messagePayload = message?.detail?.data?.payload || null;
      let messageTopic = message?.detail?.data?.topic || null;
      if (messagePayload && messageTopic) {
        console.log(["tms message payload", messageTopic, messagePayload]);
        ns.persistData(messageTopic, messagePayload);
        console.log(["tms message save to local storage", messageTopic]);
        // TODO: get host from the message.
        const host = Object.entries(ns.registery)[0];
        console.log(["tms message host", host]);
        // first idx[key, values].
        if (host) {
          // grab the topic from the host.
          const hostCallbacks = host[1];
          console.log(["tms message host topic", hostCallbacks, messageTopic, hostCallbacks[messageTopic]]);
          if (hostCallbacks) {
            console.log(["tms message call topic callbacks", hostCallbacks]);
            if(hostCallbacks && hostCallbacks[messageTopic]) {
              hostCallbacks[messageTopic](JSON.parse(messagePayload));
            }
          }
        }
      }
    });
  };

  ns.init = () => {
    ns.connect();
  };
})(Typerefinery.Page.Tms, MessageService.Client, document, window);

/* clientlib source: /apps/typerefinery/components/structure/page/clientlibs-header/events/functions.js */
window.Typerefinery = window.Typerefinery || {};
Typerefinery.Page = Typerefinery.Page || {};
Typerefinery.Page.Theme = Typerefinery.Page.Theme || {};
Typerefinery.Page.Events = Typerefinery.Page.Events || {};

(function (ns, document, window) {
    "use strict";

    ns.registery = {};

    ns.emitEvent = (topic, payload) => {
        const evt = document.createEvent('customEvent');
        evt.initCustomEvent('customEvent', false, false, { topic, payload });
        ns.socket.dispatchEvent(evt);
    };

    ns.createWebSocketConnection = () => {
        ns.socket = new EventTarget();
    };

    ns.socketListener = () => {
        ns.socket.addEventListener('customEvent', (e) => {
            const detail = e.detail;
            const { topic, payload } = detail;

            if (ns.registery[topic]) {
                ns.registery[topic].forEach((callbackFn) => {
                    if (typeof callbackFn === 'function') {
                        callbackFn(payload);
                    }
                });
            }
        });
    };

    ns.registerEvents = (topic, callbackFn) => {
        if (!ns.registery[topic]) {
            ns.registery[topic] = [callbackFn];
        } else {
            // push to array
            ns.registery[topic].push(callbackFn);
        }
    };


    ns.init = () => {
        // NOTE: socket in this ns is a custom event. It is not a websocket.
        ns.createWebSocketConnection();
        ns.socketListener();
    };

    // document ready jquery
    $(document).ready(() => {
        ns.init();
    });
})(Typerefinery.Page.Events, document, window);

