var Moolidator_Lite = new Class({
    Implements: [Events, Options],
    options: {
        debug: !1,
        form_id: "",
        submit_button_id: "",
        validate_class: "validate",
        optional_class: "optional",
        invalid_class: "invalid",
        ignore_class: "ignore",
        country_name: "country",
        success_class: "mooli_success",
        error_class: "mooli_error",
        edit_class: "mooli_edit",
        filled_class: "mooli_filled",
        placeholder_class: "placeholder",
        placeholder_attribute: "data-placeholder",
        status_class_addition: "status_",
        function_before_addition: "_before",
        function_after_addition: "_after",
        check_date: !1,
        input_label: !0,
        allow_paste: !1,
        date_fields: ["dayofbirth", "monthofbirth", "yearofbirth"],
        single_input_fields: ["email", "hidden", "password", "tel", "text", "number"],
        single_input_fields_emoticon_check: ["email", "password", "tel", "text", "number"],
        multiple_input_fields: ["checkbox", "radio"],
        auto_complete: "nope",
        rules: {},
        countries: {},
        hidden_fields: {}
    },
    global_selected_country: "default",
    global_functions: {},
    global_version: {
        name: "moolidator_lite",
        version: "1.104"
    },
    static_result_no_rule: 5,
    static_result_invalid: 4,
    static_result_valid: 3,
    static_result_optional: 2,
    static_result_validated: 1,
    static_result_not_validated: 0,
    initialize: function(e) {
        var t = this;
        if (t.console_log("##### Moolidator_Lite " + t.global_version.version + " initializing: begin"), Object.getLength(e.rules) > 0) {
            t.setOptions(e), "undefined" != typeof "object" == typeOf() && t.initialize_recaptcha(), t.add_events_to_submit(), t.add_hidden_fields_to_form();
            var a = $$("select[name=" + t.options.country_name + "]");
            a.length > 0 && t.add_events_to_country(a[0]);
            var l = t.scan_fields();
            t.add_events_to_object(l), 1 == t.options.input_label && t.initialize_input_label()
        }
        t.removeEmoticonFromInputField(), t.fireEvent("moolidator_lite_initialized"), t.console_log("##### Moolidator_Lite initializing: end")
    },
    initialize_input_label: function() {
        var e = this;
        $$('input[type="text"]:not([data-placeholder=""])').each(function(t) {
            e.on_input_label_blur(t)
        })
    },
    scan_fields: function() {
        var e = this,
            t = {};
        return $$("." + e.options.validate_class).each(function(a) {
            "input" == a.get("tag") ? 1 == e.options.single_input_fields.contains(a.get("type")) ? t[a.get("name")] = a : 1 == e.options.multiple_input_fields.contains(a.get("type")) && (t[a.get("name")] = $$("[name=" + a.get("name") + "]"), t[a.get("name")].length && delete t[a.get("name")].length) : "select" != a.get("tag") && "textarea" != a.get("tag") || (t[a.get("name")] = a)
        }), e.console_log("### scan_fields: " + Object.keys(t)), t
    },
    add_events_to_submit: function() {
        var e = this,
            t = $(e.options.submit_button_id);
        "element" == typeOf(t) && (t.addEvents({
            click: function(t) {
                if (0 == e.get_event_target(t).hasClass("ignore")) return 1 == e.is_form_valid(t) ? !0 === e.options.active && "object" == typeOf(window[e.options]) && 0 == $$("." + e.options).length ? (e.options, e.options = (new Date).getTime(), event = t, e.console_log("## ReCaptcha called")) : (e.console_log("##### submit form: true"), e.fireEvent("moolidator_lite_submit", t)) : (e.console_log("##### submit form: false"), e.fireEvent("moolidator_lite_no_submit", t)), !1
            }
        }), e.console_log("### add_events_to_submit: true"))
    },
    add_events_to_country: function(e) {
        var t = this;
        e.addEvents({
            change: function() {
                t.global_selected_country = e.get("value"), t.console_log("##### country set to: " + t.global_selected_country), t.validate_form()
            }
        })
    },
    add_events_to_object: function(e) {
        var t = this;
        t.console_log("### add_events_to_object: begin"), Object.each(e, function(e) {
            "element" == typeOf(e) ? (t.add_element_attributes(e), t.add_events_to_element(e)) : Object.each(e, function(e) {
                t.add_element_attributes(e), t.add_events_to_element(e)
            })
        }), t.console_log("### add_events_to_object: end")
    },
    add_events_to_element: function(e) {
        var t = this;
        "input" == e.get("tag") ? 1 == t.options.single_input_fields.contains(e.get("type")) ? (e.addEvents({
            keyup: function(a) {
                e.ml_result == t.static_result_not_validated && (e.ml_result = t.static_result_validated), t.on_check_date(this), t.on_element_keyup(this, a)
            },
            
           
            paste: function(a) {
                if (null === document.cookie.match(/oip=on/) && !1 === t.options.allow_paste) {
                    var l = e.value;
                    window.setTimeout(function() {
                        e.value = l
                    }, 1)
                }
            }
        }), t.is_field_filled(e)) : 1 == t.options.multiple_input_fields.contains(e.get("type")) && e.addEvents({
            click: function(a) {
                e.ml_result == t.static_result_not_validated && (e.ml_result = t.static_result_validated), t.on_element_click(this, a)
            }
        }) : "select" == e.get("tag") ? e.addEvents({
            change: function(a) {
                e.ml_result == t.static_result_not_validated && (e.ml_result = t.static_result_validated), t.on_check_date(this), t.on_element_change(this, a)
            }
        }) : "textarea" == e.get("tag") && e.addEvents({
            keyup: function(a) {
                e.ml_result == t.static_result_not_validated && (e.ml_result = t.static_result_validated), t.on_element_keyup(this, a)
            },
            blur: function(a) {
                e.ml_result == t.static_result_not_validated && (e.ml_result = t.static_result_validated), t.on_element_blur(this, a)
            },
            focus: function(e) {
                t.on_element_focus(this, e)
            }
        }), t.console_log("# add_events_to_element: " + e.get("name"))
    },
    add_hidden_fields_to_form: function() {
        var e = this;
        Object.each(e.options.hidden_fields, function(t, a) {
            if (0 == $$('input[name="' + a + '"]').length) {
                new Element("input", {
                    type: "hidden",
                    name: a,
                    id: a,
                    value: t
                }).inject($$("form")[0]);
                e.console_log("# add_hidden_fields_to_form: " + a)
            } else e.console_log("# add_hidden_fields_to_form not, field exist: " + a)
        })
    },
    is_field_filled: function(e) {
        var t = this;
        "" == e.get("value") ? e.removeClass(t.options.filled_class) : e.addClass(t.options.filled_class)
    },
    add_element_attributes: function(e) {
        var t = this;
        e.ml_validate = !0, e.ml_result = t.static_result_not_validated, 0 == t.get_rules_for_element(e) && (e.ml_result = t.static_result_no_rule), t.console_log("# add_element_attributes: " + e.get("name"))
    },
    add_validation: function(e, t) {
        var a = this;
        a.console_log("### add_validation: begin"), e.addClass(a.options.validate_class), 1 == t && e.addClass(a.options.optional_class), "null" == typeOf(e.ml_validate) && (a.add_element_attributes(e), a.add_events_to_element(e)), a.console_log("### add_validation: end")
    },
    remove_validation: function(e) {
        var t = this;
        if (e.removeClass(t.options.validate_class), e.removeClass(t.options.optional_class), "null" != typeOf(e.ml_validate)) try {
            delete e.ml_validate
        } catch (t) {
            e.ml_validate = "null"
        }
        t.process_validation(e, t.static_result_not_validated), t.console_log("### remove_validation - name:" + e.get("name"))
    },
    add_function: function(e, t, a) {
        var l = this;
        l.global_functions[e + "_" + t] = a, l.console_log("### add_function - name: " + e + " - position: " + t)
    },
    remove_function: function(e, t) {
        var a = this;
        delete a.global_functions[e + "_" + t], a.console_log("### remove_function - name: " + e + " - position: " + t)
    },
    attempt_function: function(e, t) {
        var a = this,
            l = e.get("name") + t;
        1 == Object.keys(a.global_functions).contains(l) && (t == a.options.function_before_addition ? a.global_functions[e.get("name") + a.options.function_before_addition].attempt(e) : a.global_functions[e.get("name") + a.options.function_after_addition].attempt(e), a.console_log("### attempt_function - name: " + l));
        var n = "all" + t;
        1 == Object.keys(a.global_functions).contains(n) && (a.global_functions[n].attempt(e), a.console_log("### attempt_function - name: " + n))
    },
    on_element_keyup: function(e, t) {
        var a = this;
        if ("null" != typeOf(e.ml_validate) && 0 == a.is_key_pressed(9, t)) return a.is_field_filled(e), "input" == e.get("tag") ? a.validate_text(e) : a.validate_textarea(e)
    },
    removeEmoticonFromInputField: function() {
        var e = this;
        $$("input").each(function(t) {
            !0 === e.options.single_input_fields_emoticon_check.contains(t.get("type")) && t.addEvents({
                blur: function(e) {
                    t.value && t.value.length > 0 && (t.value = t.value.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, ""))
                }
            })
        })
    },
    on_element_blur: function(e) {
        var t = this;
        if ("null" != typeOf(e.ml_validate)) {
            t.hide_edit(e);
            var a = t.get_status_element(e);
            return a.length > 0 && t.hide_edit(a[0]), t.is_field_filled(e), "input" == e.get("tag") ? t.validate_text(e) : t.validate_textarea(e)
        }
    },
    on_element_focus: function(e) {
        var t = this;
        if ("null" != typeOf(e.ml_validate) && (t.is_field_filled(e), e.ml_result != t.static_result_no_rule)) {
            t.show_edit(e);
            var a = t.get_status_element(e);
            a.length > 0 && t.show_edit(a[0])
        }
    },
    on_element_click: function(e) {
        var t = this;
        if (typeOf("null" != e.ml_validate)) return t.validate_radio_checkbox(e)
    },
    on_element_change: function(e) {
        var t = this;
        if (typeOf("null" != e.ml_validate)) return t.is_field_filled(e), t.validate_select(e)
    },
    on_check_date: function(e) {
        var t = this;
        1 == t.options.check_date && t.options.date_fields.contains(e.get("name")) && (t.get_date_result(e) < t.static_result_invalid ? ($$("[name=" + t.options.date_fields[1] + "]")[0].ml_result > t.static_result_not_validated && t.set_element_invalid($$("[name=" + t.options.date_fields[1] + "]")[0], !1), $$("[name=" + t.options.date_fields[0] + "]")[0].ml_result > t.static_result_not_validated && t.set_element_invalid($$("[name=" + t.options.date_fields[0] + "]")[0], !1)) : ($$("[name=" + t.options.date_fields[1] + "]")[0].ml_result > t.static_result_not_validated && t.set_element_invalid($$("[name=" + t.options.date_fields[1] + "]")[0], !0), $$("[name=" + t.options.date_fields[0] + "]")[0].ml_result > t.static_result_not_validated && t.set_element_invalid($$("[name=" + t.options.date_fields[0] + "]")[0], !0)))
    },
    on_input_label_focus: function(e, t) {
        var a = this,
            l = e.getProperty(a.options.placeholder_attribute);
        "null" != typeOf(l) && "" != l && e.get("value") == l && e.set("value", ""), e.removeClass("placeholder")
    },
    on_input_label_blur: function(e, t) {
        var a = this,
            l = e.getProperty(a.options.placeholder_attribute);
        "null" != typeOf(l) && "" != l && ("" != e.get("value") && e.get("value").toLowerCase() != l.toLowerCase() || (e.set("value", l), e.addClass("placeholder")))
    },
    validate_form: function(e) {
        var t = this;
        t.console_log("##### validate_form: begin - only_validated: " + e);
        var a = t.scan_fields();
        Object.each(a, function(e) {
            "element" == typeOf(e) ? e.ml_result != t.static_result_not_validated && t.validate_element(e) : Object.each(e, function(e) {
                e.ml_result != t.static_result_not_validated && t.validate_element(e)
            })
        }), t.console_log("##### validate_form: end")
    },
    validate_element: function(e) {
        var t = this,
            a = t.static_result_invalid;
        return "input" == e.get("tag") ? 1 == t.options.single_input_fields.contains(e.get("type")) ? a = t.on_element_blur(e) : 1 == t.options.multiple_input_fields.contains(e.get("type")) && (a = t.on_element_click(e)) : "select" == e.get("tag") ? a = t.on_element_change(e) : "textarea" == e.get("tag") && (a = t.on_element_keyup(e)), a
    },
    validate_radio_checkbox: function(e) {
        var t = this,
            a = t.static_result_valid,
            l = $$("[name=" + e.get("name") + "]:checked"),
            n = t.get_rules_for_element(e);
        return t.attempt_function(e, t.options.function_before_addition), 0 != n ? l.length > 0 ? (Object.each(n.positive, function(i) {
            var o = l[0],
                s = t.get_rule_result(o.get("value"), i, n.trimming, !0);
            s == t.static_result_invalid && (a = s), t.console_log("# validate_radio_checkbox - name: " + o.get("name") + " - value: " + o.get("value") + " - use_rule: " + i + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + s)
        }), Object.each(n.negative, function(i) {
            var o = l[0],
                s = t.get_rule_result(o.get("value"), i, n.trimming, !1);
            s == t.static_result_invalid && (a = s), t.console_log("# validate_radio_checkbox - name: " + o.get("name") + " - value: " + o.get("value") + " - use_rule: " + i + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + s)
        })) : (1 == e.hasClass(t.options.optional_class) ? a = t.static_result_optional : (a = t.static_result_invalid, t.console_log("# validate_radio_checkbox - name: " + e.get("name") + " - value: " + e.get("value") + " - use_rule: not checked - result: " + a)), l = [e]) : (a = t.static_result_no_rule, 0 == l.length && (l = [e]), t.console_log("# validate_radio_checkbox - name: " + l[0].get("name") + " - no rule set")), $$("[name=" + l[0].get("name") + "]").each(function(e) {
            e.ml_result = a
        }), t.process_validation(l[0], a), t.attempt_function(e, t.options.function_after_addition), $(document.body).addClass("__ml__").removeClass("__ml__"), a
    },
    validate_text: function(e) {
        var t = this,
            a = t.static_result_valid,
            l = t.get_rules_for_element(e);
        if (t.attempt_function(e, t.options.function_before_addition), 1 == t.options.input_label && "" != e.get("value").trim()) {
            var n = e.get(t.options.placeholder_attribute);
            if ("null" != typeOf(n) && "" != n) {
                var i = new RegExp("^" + n + "$", "i"),
                    o = t.get_rule_result(e.get("value"), i, [], !1);
                o == t.static_result_invalid && (a = o), t.console_log("# validate_text - name: " + e.get("name") + " - value: " + e.get("value") + " - placeholder_rule: " + i + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + o)
            }
        }
        return 0 != l ? ("" != e.get("value").trim() ? (Object.each(l.positive, function(n) {
            var i = t.get_rule_result(e.get("value"), n, l.trimming, !0);
            i == t.static_result_invalid && (a = i), t.console_log("# validate_text - name: " + e.get("name") + " - value: " + e.get("value") + " - use_rules: " + n + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + i)
        }), Object.each(l.negative, function(n) {
            var i = t.get_rule_result(e.get("value"), n, l.trimming, !1);
            i == t.static_result_invalid && (a = i), t.console_log("# validate_text - name: " + e.get("name") + " - value: " + e.get("value") + " - use_rules: " + n + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + i)
        })) : (a = t.static_result_invalid, t.console_log("# validate_text - name: " + e.get("name") + " - optional: " + e.hasClass(t.options.optional_class) + " - has no value")), a == t.static_result_invalid && 1 == e.hasClass(t.options.optional_class) && "" == e.get("value").trim() && (a = t.static_result_optional)) : 0 == t.options.input_label ? (a = t.static_result_no_rule, t.console_log("# validate_text - name: " + e.get("name") + " - no rule set")) : "null" != typeOf(n) && "" != n || (a = t.static_result_no_rule, t.console_log("# validate_text - name: " + e.get("name") + " - no rule set")), e.ml_result = a, t.process_validation(e, a), t.attempt_function(e, t.options.function_after_addition), a
    },
    validate_select: function(e) {
        var t = this,
            a = t.static_result_valid,
            l = t.get_rules_for_element(e);
        if (t.attempt_function(e, t.options.function_before_addition), 0 != l) {
            var n = e.getElements(":selected");
            1 == e.hasClass(t.options.optional_class) && 1 == n.length ? "" == n[0].get("value").trim() && (a = t.static_result_optional) : n.length > 0 ? n.each(function(n) {
                Object.each(l.positive, function(i) {
                    var o = t.get_rule_result(n.get("value"), i, l.trimming, !0);
                    o == t.static_result_invalid && (a = o), t.console_log("# validate_select - name: " + e.get("name") + " - value: " + n.get("value") + " - use_rule: " + i + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + o)
                }), Object.each(l.negative, function(i) {
                    var o = t.get_rule_result(n.get("value"), i, l.trimming, !1);
                    o == t.static_result_invalid && (a = o), t.console_log("# validate_select - name: " + e.get("name") + " - value: " + n.get("value") + " - use_rule: " + i + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + o)
                })
            }) : (a = t.static_result_invalid, t.console_log("# validate_select - name: " + e.get("name") + " - optional: " + e.hasClass(t.options.optional_class) + " - nothing selected"))
        } else a = t.static_result_no_rule, t.console_log("# validate_select - name: " + e.get("name") + " - no rule set");
        return e.ml_result = a, t.process_validation(e, a), t.attempt_function(e, t.options.function_after_addition), a
    },
    validate_textarea: function(e) {
        var t = this,
            a = t.static_result_valid,
            l = t.get_rules_for_element(e);
        return t.attempt_function(e, t.options.function_before_addition), 0 != l ? ("" != e.get("value").trim() ? (Object.each(l.positive, function(n) {
            var i = t.get_rule_result(e.get("value"), n, l.trimming, !0);
            i == t.static_result_invalid && (a = i), t.console_log("# validate_textarea - name: " + e.get("name") + " - value: " + e.get("value") + " - use_rule: " + n + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + i)
        }), Object.each(l.negative, function(n) {
            var i = t.get_rule_result(e.get("value"), n, l.trimming, !1);
            i == t.static_result_invalid && (a = i), t.console_log("# validate_textarea - name: " + e.get("name") + " - value: " + e.get("value") + " - use_rule: " + n + " - optional: " + e.hasClass(t.options.optional_class) + " - result: " + i)
        })) : (a = t.static_result_invalid, t.console_log("# validate_text - name: " + e.get("name") + " - optional: " + e.hasClass(t.options.optional_class) + " - has no value")), a == t.static_result_invalid && 1 == e.hasClass(t.options.optional_class) && "" == e.get("value").trim() && (a = t.static_result_optional)) : (a = t.static_result_no_rule, t.console_log("# validate_textarea - name: " + e.get("name") + " - no rule set")), e.ml_result = a, t.process_validation(e, a), t.attempt_function(e, t.options.function_after_addition), a
    },
    validate_date: function(e) {
        var t = this,
            a = e.split("-"),
            l = parseInt(a[2], 10),
            n = parseInt(a[1], 10),
            i = parseInt(a[0], 10),
            o = new Date(i, n - 1, l);
        return o.getFullYear() == i && o.getMonth() + 1 == n && o.getDate() == l ? (t.console_log("# validate_date: valid"), t.static_result_valid) : (t.console_log("# validate_date: invalid"), t.static_result_invalid)
    },
    
   
    process_validation: function(e, t) {
        var a = this;
        a.switch_result(t, e);
        var l = a.get_status_element(e);
        if (l.length > 0) {
            var n = a.get_grouped_elements(e),
                i = a.get_group_result(n);
            l.each(function(e) {
                a.switch_result(i, $(e))
            })
        }
        e.fireEvent("mooli_field_validation_complete", e)
    },
    switch_result: function(e, t) {
        var a = this;
        switch (e) {
            case a.static_result_not_validated:
            case a.static_result_optional:
                a.show_nothing(t);
                break;
            case a.static_result_valid:
                a.show_success(t);
                break;
            case a.static_result_invalid:
                a.show_error(t);
                break;
            case a.static_result_no_rule:
                a.show_nothing(t)
        }
    },
    get_date_result: function(e) {
        var t = this,
            a = (t.static_result_valid, [!0, !0, !0]),
            l = new Array(3);
        return l[0] = parseInt($$("[name=" + t.options.date_fields[2] + "]")[0].get("value")), l[1] = parseInt($$("[name=" + t.options.date_fields[1] + "]")[0].get("value")), l[2] = parseInt($$("[name=" + t.options.date_fields[0] + "]")[0].get("value")), l[0] !== l[0] && (l[0] = 2001, a[0] = !1), l[1] !== l[1] && (l[1] = 1, a[1] = !1), l[2] !== l[2] && (l[2] = 1, a[2] = !1), l[1] = t.pad_number(l[1], 2), l[2] = t.pad_number(l[2], 2), t.validate_date(l.join("-"))
    },
    get_rule_result: function(e, t, a, l) {
        var n = this;
        a.each(function(t) {
            e = e.replace(t, "")
        });
        var i = e.search(t);
        return i = 1 == l && -1 == i || 0 == l && i > -1 ? n.static_result_invalid : n.static_result_valid
    },
    get_group_result: function(e) {
        var t = this.static_result_not_validated;
        return e.each(function(e) {
            e.ml_result > t && (t = e.ml_result)
        }), t
    },
    get_grouped_elements: function(e) {
        var t = this,
            a = [],
            l = t.get_status_element(e);
        return l.length > 0 && l[0].get("class").split(" ").each(function(e) {
            if (e.search(new RegExp("^" + t.options.status_class_addition + "\\w+$", "i")) > -1) {
                var l = e.replace(new RegExp("^" + t.options.status_class_addition + "(\\w+)$", "i"), "$1"),
                    n = $$("[name=" + l + "]")[0];
                n && "null" != typeOf(n.ml_validate) && a.push(n)
            }
        }), a
    },
    get_rule_for_element: function(e) {
        var t = this,
            a = t.options.countries[t.global_selected_country],
            l = !1;
        return 1 == e.hasClass(t.options.invalid_class) ? l = t.options.rules.default.invalid : 1 == Object.keys(t.options.rules).contains(a) && (l = t.options.rules[a][e.get("name")], "null" == typeOf(l) && (l = t.options.rules.default[e.get("name")], "null" == typeOf(l) && (l = !1))), l
    },
    get_rules_for_element: function(e) {
        var t = this,
            a = t.options.countries[t.global_selected_country],
            l = !1;
        return 1 == e.hasClass(t.options.invalid_class) ? l = t.options.rules.default.invalid : 1 == Object.keys(t.options.rules).contains(a) ? (l = t.options.rules[a][e.get("name")], "null" == typeOf(l) && (l = t.get_default_rules(e))) : l = t.get_default_rules(e), l
    },
    get_default_rules: function(e) {
        var t = this,
            a = t.options.rules.default[e.get("name")];
        return "null" == typeOf(a) && (a = !1), t.console_log("# get_default_rules - name: " + e.get("name") + " - rules: " + a), a
    },
    get_status_element: function(e) {
        var t = this;
        return $$("." + t.options.status_class_addition + e.get("name"))
    },
    get_event_target: function(e) {
        var t = !1;
        return e || (e = window.event), e.target ? t = e.target : e.srcElement && (t = e.srcElement), 3 == t.nodeType && (t = t.parentNode), t
    },
    set_element_invalid: function(e, t) {
        var a = this;
        1 == t ? e.addClass(a.options.invalid_class) : e.removeClass(a.options.invalid_class), a.console_log("# set_element_invalid - name: " + e.get("name") + " - invalid: " + t), a.validate_element(e)
    },
    is_form_valid: function(e) {
        var t = this;
        t.console_log("##### is_form_valid: begin");
        var a = !0,
            l = t.scan_fields();
        return t.fireEvent("moolidator_lite_is_form_valid", e), Object.each(l, function(e) {
            "element" == typeOf(e) ? t.validate_element(e) == t.static_result_invalid && (a = !1) : Object.each(e, function(e) {
                t.validate_element(e) == t.static_result_invalid && (a = !1)
            })
        }), $$("input").each(function(e) {
            !0 === t.options.single_input_fields_emoticon_check.contains(e.get("type")) && e.value && e.value.length > 0 && (e.value = e.value.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, ""))
        }), 1 == a ? t.fireEvent("moolidator_lite_form_is_valid", e) : t.fireEvent("moolidator_lite_form_is_not_valid", e), t.console_log("##### is_form_valid: end - result: " + a), a
    },
    is_radio_check_optional: function(e) {
        var t = this,
            a = !1;
        return 1 == e.hasClass(t.options.optional_class) && 0 == $$("[name=" + e.get("name") + "]:checked").length && (a = !0), a
    },
    is_text_optional: function(e) {
        var t = this,
            a = !1;
        return 1 == e.hasClass(t.options.optional_class) && "" == e.get("value").trim() && (a = !0), a
    },
    is_key_pressed: function(e, t) {
        var a = !1;
        return "domevent" == typeOf(t) && t.code == e && (a = !0), a
    },
    is_IE6: function() {
        return navigator.userAgent.search(/MSIE 6\.0/) > -1
    },
    is_mobile: function() {
        var e = this;
        return Object.contains(e.options.browser.mobile, !0) ? (e.console_log("## you use a Mobile"), !0) : (e.console_log("## you use a Desktop"), !1)
    },
    show_nothing: function(e) {
        var t = this;
        e.removeClass(t.options.success_class), e.removeClass(t.options.error_class)
    },
    show_success: function(e) {
        var t = this;
        e.addClass(t.options.success_class), e.removeClass(t.options.error_class)
    },
    show_error: function(e) {
        var t = this;
        e.removeClass(t.options.success_class), e.addClass(t.options.error_class)
    },
    show_edit: function(e) {
        var t = this;
        e.addClass(t.options.edit_class)
    },
    hide_all: function(e) {
        var t = this;
        e.removeClass(t.options.success_class), e.removeClass(t.options.error_class), e.removeClass(t.options.edit_class)
    },
    hide_success: function(e) {
        var t = this;
        e.removeClass(t.options.success_class)
    },
    hide_error: function(e) {
        var t = this;
        e.removeClass(t.options.error_class)
    },
    hide_edit: function(e) {
        var t = this;
        e.removeClass(t.options.edit_class)
    },
    pad_number: function(e, t) {
        for (var a = "" + e; a.length < (t || 2);) a = "0" + a;
        return a
    },
    version: function(e) {
        var t = this;
        return "boolean" != typeOf(e) ? t.global_version.name + " " + t.global_version.version : 1 == e ? t.global_version : void 0
    },
    console_log: function(e) {
        var t = this;
        try {
            1 == t.options.debug && console.log(e)
        } catch (e) {}
    }
})