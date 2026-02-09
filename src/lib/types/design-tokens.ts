/**
 * Configuration for how a CSS custom property should be registered
 */
export interface PropertyConfig {
	/** CSS syntax type - see https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax */
	syntax: string;
	/** Whether child elements inherit this property value */
	inherits: boolean;
}

export type PropertyValue = string | boolean | number;

export type PropertyData = {
	[key: string]: PropertyValue | PropertyData | PropertyConfig | undefined;
};

export type PropertyNode = PropertyData & {
	config?: PropertyConfig;
};
