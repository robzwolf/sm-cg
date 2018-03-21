var VSHADER_SOURCE = `

    attribute vec4 a_Position;
    attribute vec4 a_Color;
    attribute vec4 a_Normal;
    attribute vec2 a_TexCoord;
    uniform mat4 u_MvpMatrix;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;
    uniform bool u_IsTexture;
    uniform float u_Scale;
    varying vec4 v_Color;
    varying vec3 v_Normal;
    varying vec3 v_Position;
    varying vec2 v_TexCoord;

    void main()
    {
        gl_Position = u_MvpMatrix * a_Position;
        v_Position = vec3(u_ModelMatrix * a_Position);
        v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
        if (u_IsTexture)
        {
            v_TexCoord = a_TexCoord * u_Scale;
        }
        else
        {
            v_Color = a_Color;
        }
    }

`

console.log("Loaded VSHADER_SOURCE");
