import { isAngularIvyType, isClassConstructor, isFactoryFunction } from './invocation-guards';
import { Component } from '@angular/core';

@Component({ standalone: true, template: '' })
class DummyCmp {}

class PlainClass {}

function factoryFn() { return 42; }

describe('invocation-guards', () => {
  it('detects Angular Ivy types', () => {
    expect(isAngularIvyType(DummyCmp)).toBe(true);
  });

  it('detects ES class constructors', () => {
    expect(isClassConstructor(PlainClass)).toBe(true);
    expect(isClassConstructor(class X {})).toBe(true);
    expect(isClassConstructor(factoryFn)).toBe(false);
  });

  it('detects safe factory functions only', () => {
    expect(isFactoryFunction(factoryFn)).toBe(true);
    expect(isFactoryFunction(DummyCmp)).toBe(false);
    expect(isFactoryFunction(PlainClass)).toBe(false);
  });
});