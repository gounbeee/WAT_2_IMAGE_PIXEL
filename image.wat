(module

  (memory (;0;) 3)

  (type (;0;) (func))
  (type (;1;) (func (param i32 i32) (result i32)))
 

  (func $getPixel (type 1) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.const 2
    i32.shl
    i32.add
    i32.load

  )

  (export "memory" (memory 0))
  (export "getPixel" (func $getPixel))

)
