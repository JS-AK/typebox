import { Assert } from '../../assert'
import { Value } from '@sinclair/typebox/value'
import { Type, Kind, TypeRegistry } from '@sinclair/typebox'

describe('value/transform/Unsafe', () => {
  // --------------------------------------------------------
  // Fixtures
  // --------------------------------------------------------
  beforeEach(() => TypeRegistry.Set('Foo', (schema, value) => value !== null)) // throw on null
  afterEach(() => TypeRegistry.Delete('Foo'))
  const Foo = Type.Unsafe<string>({ [Kind]: 'Foo' })
  // --------------------------------------------------------
  // Identity
  // --------------------------------------------------------
  const T0 = Type.Transform(Foo)
    .Decode((value) => value)
    .Encode((value) => value)
  it('Should decode identity', () => {
    const R = Value.Decode(T0, 'hello')
    Assert.IsEqual(R, 'hello')
  })
  it('Should encode identity', () => {
    const R = Value.Encode(T0, 'hello')
    Assert.IsEqual(R, 'hello')
  })
  it('Should throw on identity decode', () => {
    Assert.Throws(() => Value.Decode(T0, null))
  })
  // --------------------------------------------------------
  // Mapped
  // --------------------------------------------------------
  const T1 = Type.Transform(Foo)
    .Decode((value) => value.split('').reverse().join(''))
    .Encode((value) => value.split('').reverse().join(''))
  it('Should decode mapped', () => {
    const R = Value.Decode(T1, 'ABC')
    Assert.IsEqual(R, 'CBA')
  })
  it('Should encode mapped', () => {
    const R = Value.Encode(T1, 'CBA')
    Assert.IsEqual(R, 'ABC')
  })
  it('Should throw on mapped decode', () => {
    Assert.Throws(() => Value.Decode(T1, null))
  })
})
