// Fragment shader program
CG.shaders.FSHADER_SOURCE = `

    #ifdef GL_ES
    precision mediump float;
    #endif
    
    uniform vec3 u_LightColor1;
    uniform vec3 u_LightColor2;
    uniform vec3 u_LightColor3;
    uniform vec3 u_LightColor4;
    uniform vec3 u_LightColor5;
    uniform vec3 u_LightColor6;
    uniform vec3 u_LightColor7;
    uniform vec3 u_LightColor8;
    uniform vec3 u_LightColor9;
    uniform vec3 u_LightColor10;
    uniform vec3 u_LightColor11;
    uniform vec3 u_LightColor12;
    uniform vec3 u_LightColor13;
    uniform vec3 u_LightColor14;
    uniform vec3 u_LightColor15;
    uniform vec3 u_LightColor16;
    uniform vec3 u_LightColor17;
    uniform vec3 u_LightColor18;
    uniform vec3 u_LightColor19;
    uniform vec3 u_LightColor20;
    uniform vec3 u_LightPos1;
    uniform vec3 u_LightPos2;
    uniform vec3 u_LightPos3;
    uniform vec3 u_LightPos4;
    uniform vec3 u_LightPos5;
    uniform vec3 u_LightPos6;
    uniform vec3 u_LightPos7;
    uniform vec3 u_LightPos8;
    uniform vec3 u_LightPos9;
    uniform vec3 u_LightPos10;
    uniform vec3 u_LightPos11;
    uniform vec3 u_LightPos12;
    uniform vec3 u_LightPos13;
    uniform vec3 u_LightPos14;
    uniform vec3 u_LightPos15;
    uniform vec3 u_LightPos16;
    uniform vec3 u_LightPos17;
    uniform vec3 u_LightPos18;
    uniform vec3 u_LightPos19;
    uniform vec3 u_LightPos20;
    uniform vec3 u_AmbientLight;
    uniform bool u_IsTexture;
    uniform sampler2D u_Sampler;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    varying vec4 v_Color;
    varying vec2 v_TexCoord;
    void main() {
      vec3 normal = normalize(v_Normal);
      vec3 lightDir1  = normalize(u_LightPos1  - v_Position);
      vec3 lightDir2  = normalize(u_LightPos2  - v_Position);
      vec3 lightDir3  = normalize(u_LightPos3  - v_Position);
      vec3 lightDir4  = normalize(u_LightPos4  - v_Position);
      vec3 lightDir5  = normalize(u_LightPos5  - v_Position);
      vec3 lightDir6  = normalize(u_LightPos6  - v_Position);
      vec3 lightDir7  = normalize(u_LightPos7  - v_Position);
      vec3 lightDir8  = normalize(u_LightPos8  - v_Position);
      vec3 lightDir9  = normalize(u_LightPos9  - v_Position);
      vec3 lightDir10 = normalize(u_LightPos10 - v_Position);
      vec3 lightDir11 = normalize(u_LightPos11 - v_Position);
      vec3 lightDir12 = normalize(u_LightPos12 - v_Position);
      vec3 lightDir13 = normalize(u_LightPos13 - v_Position);
      vec3 lightDir14 = normalize(u_LightPos14 - v_Position);
      vec3 lightDir15 = normalize(u_LightPos15 - v_Position);
      vec3 lightDir16 = normalize(u_LightPos16 - v_Position);
      vec3 lightDir17 = normalize(u_LightPos17 - v_Position);
      vec3 lightDir18 = normalize(u_LightPos18 - v_Position);
      vec3 lightDir19 = normalize(u_LightPos19 - v_Position);
      vec3 lightDir20 = normalize(u_LightPos20 - v_Position);
      float nDotL1  = 200.0*max(dot(lightDir1,  normal), 0.0) / dot(u_LightPos1  - v_Position, u_LightPos1  - v_Position);
      float nDotL2  = 200.0*max(dot(lightDir2,  normal), 0.0) / dot(u_LightPos2  - v_Position, u_LightPos2  - v_Position);
      float nDotL3  = 200.0*max(dot(lightDir3,  normal), 0.0) / dot(u_LightPos3  - v_Position, u_LightPos3  - v_Position);
      float nDotL4  = 200.0*max(dot(lightDir4,  normal), 0.0) / dot(u_LightPos4  - v_Position, u_LightPos4  - v_Position);
      float nDotL5  = 200.0*max(dot(lightDir5,  normal), 0.0) / dot(u_LightPos5  - v_Position, u_LightPos5  - v_Position);
      float nDotL6  = 200.0*max(dot(lightDir6,  normal), 0.0) / dot(u_LightPos6  - v_Position, u_LightPos6  - v_Position);
      float nDotL7  = 200.0*max(dot(lightDir7,  normal), 0.0) / dot(u_LightPos7  - v_Position, u_LightPos7  - v_Position);
      float nDotL8  = 200.0*max(dot(lightDir8,  normal), 0.0) / dot(u_LightPos8  - v_Position, u_LightPos8  - v_Position);
      float nDotL9  = 200.0*max(dot(lightDir9,  normal), 0.0) / dot(u_LightPos9  - v_Position, u_LightPos9  - v_Position);
      float nDotL10 = 200.0*max(dot(lightDir10, normal), 0.0) / dot(u_LightPos10 - v_Position, u_LightPos10 - v_Position);
      float nDotL11 = 200.0*max(dot(lightDir11, normal), 0.0) / dot(u_LightPos11 - v_Position, u_LightPos11 - v_Position);
      float nDotL12 = 200.0*max(dot(lightDir12, normal), 0.0) / dot(u_LightPos12 - v_Position, u_LightPos12 - v_Position);
      float nDotL13 = 200.0*max(dot(lightDir13, normal), 0.0) / dot(u_LightPos13 - v_Position, u_LightPos13 - v_Position);
      float nDotL14 = 200.0*max(dot(lightDir14, normal), 0.0) / dot(u_LightPos14 - v_Position, u_LightPos14 - v_Position);
      float nDotL15 = 200.0*max(dot(lightDir15, normal), 0.0) / dot(u_LightPos15 - v_Position, u_LightPos15 - v_Position);
      float nDotL16 = 200.0*max(dot(lightDir16, normal), 0.0) / dot(u_LightPos16 - v_Position, u_LightPos16 - v_Position);
      float nDotL17 = 200.0*max(dot(lightDir17, normal), 0.0) / dot(u_LightPos17 - v_Position, u_LightPos17 - v_Position);
      float nDotL18 = 200.0*max(dot(lightDir18, normal), 0.0) / dot(u_LightPos18 - v_Position, u_LightPos18 - v_Position);
      float nDotL19 = 200.0*max(dot(lightDir19, normal), 0.0) / dot(u_LightPos19 - v_Position, u_LightPos19 - v_Position);
      float nDotL20 = 200.0*max(dot(lightDir20, normal), 0.0) / dot(u_LightPos20 - v_Position, u_LightPos20 - v_Position);
      vec4 visableColor;
      if(u_IsTexture)
      {
        visableColor = texture2D(u_Sampler, v_TexCoord);
      }
      else
      {
        visableColor = v_Color;
      }
      vec3 diffuse = visableColor.rgb * (u_LightColor1*nDotL1 + u_LightColor2*nDotL2 + u_LightColor3*nDotL3 + u_LightColor4*nDotL4 + u_LightColor5*nDotL5 + u_LightColor6*nDotL6 + u_LightColor7*nDotL7 + u_LightColor8*nDotL8 + u_LightColor9*nDotL9 + u_LightColor10*nDotL10 + u_LightColor11*nDotL11 + u_LightColor12*nDotL12 + u_LightColor13*nDotL13 + u_LightColor14*nDotL14 + u_LightColor15*nDotL15 + u_LightColor16*nDotL16 + u_LightColor17*nDotL17 + u_LightColor18*nDotL18 + u_LightColor19*nDotL19 + u_LightColor20*nDotL20);
      vec3 ambient = u_AmbientLight * visableColor.rgb;
      gl_FragColor = vec4(diffuse + ambient, visableColor.a);
    }

`
