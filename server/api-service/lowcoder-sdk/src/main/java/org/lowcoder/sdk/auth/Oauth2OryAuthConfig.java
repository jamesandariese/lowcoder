package org.lowcoder.sdk.auth;

import static org.lowcoder.sdk.auth.constants.Oauth2Constants.BASE_URL_PLACEHOLDER;
import static org.lowcoder.sdk.auth.constants.Oauth2Constants.SCOPE_PLACEHOLDER;

import javax.annotation.Nullable;

import com.fasterxml.jackson.annotation.JsonCreator;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

/**
 * OAuth2 ORY auth config.
 */
@Getter
@SuperBuilder
@Jacksonized
public class Oauth2OryAuthConfig extends Oauth2SimpleAuthConfig {

    protected String baseUrl;
    protected String scope;

    @Override
    public String replaceAuthUrlClientIdPlaceholder(String url) {
        return super.replaceAuthUrlClientIdPlaceholder(url)
        		.replace(BASE_URL_PLACEHOLDER, baseUrl)
        		.replace(SCOPE_PLACEHOLDER, scope);
    }
}
