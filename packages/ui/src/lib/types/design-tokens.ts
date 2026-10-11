/**
 * Configuration for how a CSS custom property should be registered
 */
export interface DesignTokenConfig {
	/** CSS syntax type - see https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax */
	syntax: string;
	/** Whether child elements inherit this property value */
	inherits: boolean;
}

export type DesignTokenValue = string | boolean | number;

export type DesignTokenEntry = {
	[key: string]: DesignTokenValue | DesignTokenNode;
};

export type DesignTokenNode = DesignTokenEntry & {
	config?: DesignTokenConfig;
};

export type DesignTokenData = DesignTokenValue | DesignTokenConfig;
