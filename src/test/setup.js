
import '@testing-library/jest-dom/vitest'

// Mock IntersectionObserver for jsdom
class IntersectionObserverMock {
  constructor(callback) {
    this._callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  window.IntersectionObserver = IntersectionObserverMock
  globalThis.IntersectionObserver = IntersectionObserverMock
}

// Mock WebGL context for OGL (jsdom doesn't support canvas)
if (typeof HTMLCanvasElement !== 'undefined') {
  const originalGetContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (type, ...args) {
    if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
      return {
        canvas: this,
        drawingBufferWidth: 1,
        drawingBufferHeight: 1,
        getExtension: () => null,
        createShader: () => ({}),
        shaderSource: () => {},
        compileShader: () => {},
        getShaderParameter: () => true,
        createProgram: () => ({}),
        attachShader: () => {},
        linkProgram: () => {},
        getProgramParameter: () => true,
        useProgram: () => {},
        getAttribLocation: () => 0,
        getUniformLocation: () => ({}),
        uniform1f: () => {},
        uniform2f: () => {},
        uniform3f: () => {},
        uniform1i: () => {},
        uniformMatrix4fv: () => {},
        createBuffer: () => ({}),
        bindBuffer: () => {},
        bufferData: () => {},
        enableVertexAttribArray: () => {},
        vertexAttribPointer: () => {},
        createTexture: () => ({}),
        bindTexture: () => {},
        texImage2D: () => {},
        texParameteri: () => {},
        activeTexture: () => {},
        viewport: () => {},
        clearColor: () => {},
        clear: () => {},
        enable: () => {},
        disable: () => {},
        blendFunc: () => {},
        drawArrays: () => {},
        drawElements: () => {},
        deleteShader: () => {},
        deleteProgram: () => {},
        deleteBuffer: () => {},
        deleteTexture: () => {},
        pixelStorei: () => {},
        generateMipmap: () => {},
        createFramebuffer: () => ({}),
        bindFramebuffer: () => {},
        framebufferTexture2D: () => {},
        createRenderbuffer: () => ({}),
        bindRenderbuffer: () => {},
        renderbufferStorage: () => {},
        framebufferRenderbuffer: () => {},
        ARRAY_BUFFER: 34962,
        ELEMENT_ARRAY_BUFFER: 34963,
        STATIC_DRAW: 35044,
        FLOAT: 5126,
        UNSIGNED_SHORT: 5123,
        TRIANGLES: 4,
        POINTS: 0,
        VERTEX_SHADER: 35633,
        FRAGMENT_SHADER: 35632,
        LINK_STATUS: 35714,
        COMPILE_STATUS: 35713,
        TEXTURE_2D: 3553,
        TEXTURE0: 33984,
        RGBA: 6408,
        UNSIGNED_BYTE: 5121,
        TEXTURE_MIN_FILTER: 10241,
        TEXTURE_MAG_FILTER: 10240,
        LINEAR: 9729,
        NEAREST: 9728,
        TEXTURE_WRAP_S: 10242,
        TEXTURE_WRAP_T: 10243,
        CLAMP_TO_EDGE: 33071,
        DEPTH_TEST: 2929,
        BLEND: 3042,
        SRC_ALPHA: 770,
        ONE_MINUS_SRC_ALPHA: 771,
        COLOR_BUFFER_BIT: 16384,
        DEPTH_BUFFER_BIT: 256,
        UNPACK_FLIP_Y_WEBGL: 37440,
        FRAMEBUFFER: 36160,
        RENDERBUFFER: 36161,
        COLOR_ATTACHMENT0: 36064,
        DEPTH_ATTACHMENT: 36096,
        DEPTH_COMPONENT16: 33189,
      }
    }
    return originalGetContext.call(this, type, ...args)
  }
}

