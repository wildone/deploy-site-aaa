import Portal from 'primevue/portal';
import ToastEventBus from 'primevue/toasteventbus';
import { ZIndexUtils, ObjectUtils, UniqueComponentId } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveDirective, openBlock, createElementBlock, normalizeClass, createElementVNode, Fragment, toDisplayString, createBlock, resolveDynamicComponent, withDirectives, mergeProps, createCommentVNode, resolveComponent, withCtx, createVNode, TransitionGroup, renderList } from 'vue';

var script$1 = {
    name: 'ToastMessage',
    emits: ['close'],
    props: {
        message: {
            type: null,
            default: null
        },
        template: {
            type: null,
            default: null
        },
        closeIcon: {
            type: String,
            default: null
        },
        infoIcon: {
            type: String,
            default: null
        },
        warnIcon: {
            type: String,
            default: null
        },
        errorIcon: {
            type: String,
            default: null
        },
        successIcon: {
            type: String,
            default: null
        },
        closeButtonProps: {
            type: null,
            default: null
        }
    },
    closeTimeout: null,
    mounted() {
        if (this.message.life) {
            this.closeTimeout = setTimeout(() => {
                this.close();
            }, this.message.life);
        }
    },
    beforeUnmount() {
        this.clearCloseTimeout();
    },
    methods: {
        close() {
            this.$emit('close', this.message);
        },
        onCloseClick() {
            this.clearCloseTimeout();
            this.close();
        },
        clearCloseTimeout() {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
                this.closeTimeout = null;
            }
        }
    },
    computed: {
        containerClass() {
            return [
                'p-toast-message',
                this.message.styleClass,
                {
                    'p-toast-message-info': this.message.severity === 'info',
                    'p-toast-message-warn': this.message.severity === 'warn',
                    'p-toast-message-error': this.message.severity === 'error',
                    'p-toast-message-success': this.message.severity === 'success'
                }
            ];
        },
        iconClass() {
            return [
                'p-toast-message-icon',
                {
                    [this.infoIcon]: this.message.severity === 'info',
                    [this.warnIcon]: this.message.severity === 'warn',
                    [this.errorIcon]: this.message.severity === 'error',
                    [this.successIcon]: this.message.severity === 'success'
                }
            ];
        },
        closeAriaLabel() {
            return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : undefined;
        }
    },
    directives: {
        ripple: Ripple
    }
};

const _hoisted_1 = { class: "p-toast-message-text" };
const _hoisted_2 = { class: "p-toast-summary" };
const _hoisted_3 = { class: "p-toast-detail" };
const _hoisted_4 = { key: 2 };
const _hoisted_5 = ["aria-label"];

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createElementBlock("div", {
    class: normalizeClass($options.containerClass),
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  }, [
    createElementVNode("div", {
      class: normalizeClass(["p-toast-message-content", $props.message.contentStyleClass])
    }, [
      (!$props.template)
        ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            createElementVNode("span", {
              class: normalizeClass($options.iconClass)
            }, null, 2),
            createElementVNode("div", _hoisted_1, [
              createElementVNode("span", _hoisted_2, toDisplayString($props.message.summary), 1),
              createElementVNode("div", _hoisted_3, toDisplayString($props.message.detail), 1)
            ])
          ], 64))
        : (openBlock(), createBlock(resolveDynamicComponent($props.template), {
            key: 1,
            message: $props.message
          }, null, 8, ["message"])),
      ($props.message.closable !== false)
        ? (openBlock(), createElementBlock("div", _hoisted_4, [
            withDirectives((openBlock(), createElementBlock("button", mergeProps({
              class: "p-toast-icon-close p-link",
              type: "button",
              "aria-label": $options.closeAriaLabel,
              onClick: _cache[0] || (_cache[0] = (...args) => ($options.onCloseClick && $options.onCloseClick(...args))),
              autofocus: ""
            }, $props.closeButtonProps), [
              createElementVNode("span", {
                class: normalizeClass(['p-toast-icon-close-icon', $props.closeIcon])
              }, null, 2)
            ], 16, _hoisted_5)), [
              [_directive_ripple]
            ])
          ]))
        : createCommentVNode("", true)
    ], 2)
  ], 2))
}

script$1.render = render$1;

var messageIdx = 0;

var script = {
    name: 'Toast',
    inheritAttrs: false,
    props: {
        group: {
            type: String,
            default: null
        },
        position: {
            type: String,
            default: 'top-right'
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        breakpoints: {
            type: Object,
            default: null
        },
        closeIcon: {
            type: String,
            default: 'pi pi-times'
        },
        infoIcon: {
            type: String,
            default: 'pi pi-info-circle'
        },
        warnIcon: {
            type: String,
            default: 'pi pi-exclamation-triangle'
        },
        errorIcon: {
            type: String,
            default: 'pi pi-times'
        },
        successIcon: {
            type: String,
            default: 'pi pi-check'
        },
        closeButtonProps: {
            type: null,
            default: null
        }
    },
    data() {
        return {
            messages: []
        };
    },
    styleElement: null,
    mounted() {
        ToastEventBus.on('add', this.onAdd);
        ToastEventBus.on('remove-group', this.onRemoveGroup);
        ToastEventBus.on('remove-all-groups', this.onRemoveAllGroups);

        if (this.breakpoints) {
            this.createStyle();
        }
    },
    beforeUnmount() {
        this.destroyStyle();

        if (this.$refs.container && this.autoZIndex) {
            ZIndexUtils.clear(this.$refs.container);
        }

        ToastEventBus.off('add', this.onAdd);
        ToastEventBus.off('remove-group', this.onRemoveGroup);
        ToastEventBus.off('remove-all-groups', this.onRemoveAllGroups);
    },
    methods: {
        add(message) {
            if (message.id == null) {
                message.id = messageIdx++;
            }

            this.messages = [...this.messages, message];
        },
        remove(message) {
            let index = -1;

            for (let i = 0; i < this.messages.length; i++) {
                if (this.messages[i] === message) {
                    index = i;
                    break;
                }
            }

            this.messages.splice(index, 1);
        },
        onAdd(message) {
            if (this.group == message.group) {
                this.add(message);
            }
        },
        onRemoveGroup(group) {
            if (this.group === group) {
                this.messages = [];
            }
        },
        onRemoveAllGroups() {
            this.messages = [];
        },
        onEnter() {
            this.$refs.container.setAttribute(this.attributeSelector, '');

            if (this.autoZIndex) {
                ZIndexUtils.set('modal', this.$refs.container, this.baseZIndex || this.$primevue.config.zIndex.modal);
            }
        },
        onLeave() {
            if (this.$refs.container && this.autoZIndex && ObjectUtils.isEmpty(this.messages)) {
                setTimeout(() => {
                    ZIndexUtils.clear(this.$refs.container);
                }, 200);
            }
        },
        createStyle() {
            if (!this.styleElement) {
                this.styleElement = document.createElement('style');
                this.styleElement.type = 'text/css';
                document.head.appendChild(this.styleElement);

                let innerHTML = '';

                for (let breakpoint in this.breakpoints) {
                    let breakpointStyle = '';

                    for (let styleProp in this.breakpoints[breakpoint]) {
                        breakpointStyle += styleProp + ':' + this.breakpoints[breakpoint][styleProp] + '!important;';
                    }

                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-toast[${this.attributeSelector}] {
                                ${breakpointStyle}
                            }
                        }
                    `;
                }

                this.styleElement.innerHTML = innerHTML;
            }
        },
        destroyStyle() {
            if (this.styleElement) {
                document.head.removeChild(this.styleElement);
                this.styleElement = null;
            }
        }
    },
    computed: {
        containerClass() {
            return [
                'p-toast p-component p-toast-' + this.position,
                {
                    'p-input-filled': this.$primevue.config.inputStyle === 'filled',
                    'p-ripple-disabled': this.$primevue.config.ripple === false
                }
            ];
        },
        attributeSelector() {
            return UniqueComponentId();
        }
    },
    components: {
        ToastMessage: script$1,
        Portal: Portal
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ToastMessage = resolveComponent("ToastMessage");
  const _component_Portal = resolveComponent("Portal");

  return (openBlock(), createBlock(_component_Portal, null, {
    default: withCtx(() => [
      createElementVNode("div", mergeProps({
        ref: "container",
        class: $options.containerClass
      }, _ctx.$attrs), [
        createVNode(TransitionGroup, {
          name: "p-toast-message",
          tag: "div",
          onEnter: $options.onEnter,
          onLeave: $options.onLeave
        }, {
          default: withCtx(() => [
            (openBlock(true), createElementBlock(Fragment, null, renderList($data.messages, (msg) => {
              return (openBlock(), createBlock(_component_ToastMessage, {
                key: msg.id,
                message: msg,
                template: _ctx.$slots.message,
                closeIcon: $props.closeIcon,
                infoIcon: $props.infoIcon,
                warnIcon: $props.warnIcon,
                errorIcon: $props.errorIcon,
                successIcon: $props.successIcon,
                closeButtonProps: $props.closeButtonProps,
                onClose: _cache[0] || (_cache[0] = $event => ($options.remove($event)))
              }, null, 8, ["message", "template", "closeIcon", "infoIcon", "warnIcon", "errorIcon", "successIcon", "closeButtonProps"]))
            }), 128))
          ]),
          _: 1
        }, 8, ["onEnter", "onLeave"])
      ], 16)
    ]),
    _: 1
  }))
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.p-toast {\n    position: fixed;\n    width: 25rem;\n}\n.p-toast-message-content {\n    display: flex;\n    align-items: flex-start;\n}\n.p-toast-message-text {\n    flex: 1 1 auto;\n}\n.p-toast-top-right {\n    top: 20px;\n    right: 20px;\n}\n.p-toast-top-left {\n    top: 20px;\n    left: 20px;\n}\n.p-toast-bottom-left {\n    bottom: 20px;\n    left: 20px;\n}\n.p-toast-bottom-right {\n    bottom: 20px;\n    right: 20px;\n}\n.p-toast-top-center {\n    top: 20px;\n    left: 50%;\n    transform: translateX(-50%);\n}\n.p-toast-bottom-center {\n    bottom: 20px;\n    left: 50%;\n    transform: translateX(-50%);\n}\n.p-toast-center {\n    left: 50%;\n    top: 50%;\n    min-width: 20vw;\n    transform: translate(-50%, -50%);\n}\n.p-toast-icon-close {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n.p-toast-icon-close.p-link {\n    cursor: pointer;\n}\n\n/* Animations */\n.p-toast-message-enter-from {\n    opacity: 0;\n    -webkit-transform: translateY(50%);\n    -ms-transform: translateY(50%);\n    transform: translateY(50%);\n}\n.p-toast-message-leave-from {\n    max-height: 1000px;\n}\n.p-toast .p-toast-message.p-toast-message-leave-to {\n    max-height: 0;\n    opacity: 0;\n    margin-bottom: 0;\n    overflow: hidden;\n}\n.p-toast-message-enter-active {\n    -webkit-transition: transform 0.3s, opacity 0.3s;\n    transition: transform 0.3s, opacity 0.3s;\n}\n.p-toast-message-leave-active {\n    -webkit-transition: max-height 0.45s cubic-bezier(0, 1, 0, 1), opacity 0.3s, margin-bottom 0.3s;\n    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1), opacity 0.3s, margin-bottom 0.3s;\n}\n";
styleInject(css_248z);

script.render = render;

export { script as default };
