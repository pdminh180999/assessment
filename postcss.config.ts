import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from "autoprefixer";

const property_to_custom_prop = () => ({
    postcssPlugin: 'postcss-property-to-custom-prop',
    prepare() {
        const properties: { name: any; value: string; }[] = [];

        return {
            AtRule: {
                property: (rule: { params: { match: (arg0: RegExp) => any[]; }; walkDecls: (arg0: string, arg1: (decl: any) => void) => void; remove: () => void; }) => {
                    const property_name = rule.params.match(/--[\w-]+/)?.[0];
                    let initial_value = '';

                    rule.walkDecls('initial-value', (decl) => {
                        initial_value = decl.value;
                    });

                    if (property_name && initial_value) {
                        properties.push({ name: property_name, value: initial_value });
                        rule.remove();
                    }
                },
            },
            OnceExit(root: { prepend: (arg0: any) => void; }, { Rule, Declaration }: any) {
                if (properties.length > 0) {
                    const root_rule = new Rule({ selector: ':root, :host' });

                    for (const prop of properties) {
                        root_rule.append(
                            new Declaration({
                                prop: prop.name,
                                value: prop.value,
                            }),
                        );
                    }

                    root.prepend(root_rule);
                }
            },
        };
    },
});

property_to_custom_prop.postcss = true;


export default {
    plugins: [
        tailwindcss(),
        autoprefixer(),
        property_to_custom_prop(),
    ],
};
