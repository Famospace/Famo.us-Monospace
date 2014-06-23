define(function(require, exports, module) {

    var levels = {
      demoLevel: {
        smallCube: [
                    // back face
                    [1, 2, 0],
                    [2, 0, 0],
                    [3, 1, 0],

                    // md back
                    [0, 0, 1],
                    [2, 3, 1],

                    // md front
                    [1, 0, 2],
                    [3, 3, 2],

                    // front
                    [0, 2, 3],
                    [1, 3, 3],
                    [2, 1, 3],
                    [3, 0, 3]
        ],
        
        destroyer: [0, 3, 0]
      },

      introVideo: {
        smallCube: [
                    // back face
                    [0, 0, 0],

                    // md back
                    [0, 0, 1],

                    // md front
                    [ 2, 1, 2],
                    [ 2, 1, 2],

                    // front
                    [ 2, 1, 3]
        ],

        destroyer: [0, 3, 0]
      },

      levels: [
        {// level 1
            smallCube: [
                        [1, 3, 3],
                        [2, 3, 3],
                        [3, 3, 3]
                        ],
            
            destroyer: [0, 3, 3]
        },

        {// level 2
            smallCube: [
                        [1, 0, 3],
                        [2, 0, 3],
                        [3, 0, 3]
                        ],
            
            destroyer: [0, 3, 3]
        },

        {// level 3
            smallCube: [
                        [0, 2, 0],
                        [3, 1, 0],
                        [3, 0, 3]
                        ],
            
            destroyer: [0, 3, 3]
        },

        {// level 4
            smallCube: [
                        [0, 2, 0],
                        [3, 1, 0],
                        [3, 0, 3]
                        ],
            
            destroyer: [0, 3, 3]
        },

      ],
    };

    module.exports = levels;
});
