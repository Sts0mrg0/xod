{{ globals }}

namespace xod {
{{#if (or (containsConstantInputs patch.inputs) (containsTemplatableCustomTypeInputs patch.inputs))~}}
template <
  {{~#each (constantInputs patch.inputs)~}}
    {{ cppType type }} constant_value_{{ pinKey }}
    {{~#unless @last}}, {{/unless}}
  {{~/each~}}
  {{~#if (and (containsConstantInputs patch.inputs) (containsTemplatableCustomTypeInputs patch.inputs))}}, {{/if}}
  {{~#each (templatableCustomTypeInputs patch.inputs)~}}
    typename TypeOfConstructorNode{{ pinKey }}
    {{~#unless @last}}, {{/unless}}
  {{~/each~}}
>
{{/if}}
struct {{ ns patch }} {
{{ indent patchPinTypes }}

{{ indent beforeNodeImplementation }}

{{ indent generatedCode }}

{{ indent insideNodeImplementation }}
};
} // namespace xod