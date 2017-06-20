# Typescript Math Toolkit Matrix

This is the alpha release of the Typescript Math Toolkit Matrix class for creating and transforming dense matrices, as well as solving small, dense systems of linear equations.

As with many other classes in the toolkit, the primary purpose of this alpha release is to spur additional testing and API feedback.  For example, will there ever be a need to compute matrix norms, eigenvalues, SVD?  If so, is this capability better exposed in an advanced Matrix class?

Inquiring minds want to know :)


Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 2.3.2

Version: 1.0


## Installation

Installation involves all the usual suspects

  - npm and gulp installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. gulp compile

2. gulp test

The test suite is in Mocha/Chai and specs reside in the _test_ folder.


### TSMT$Matrix

The _TSMT$Matrix_ class represents a dense, _m x n_ matrix as an array of _m_ arrays of type _number_, each of length _n_.

The _TSMT$Matrix_ class may also be used to solve linear equations of the form _Ax = b_.  This is accomplished by an _LU_ factorization and backsolve.  Since the factorization is expensive, it is only updated if matrix data changes.

Even if the data is sparse and contains a significant number of zeros, the _TSMT$Matrix_ class always treats a matrix as dense.


The list of public methods for the _TSMT$Matrix_ class is as follows:

```
fromArray( matrix: Array<Array<number>> ): void
get factorized():boolean
get m(): number
get n(): number
getRow(index: number): Array<number>
getColumn(index: number): Array<number>
clear(): void
addRow(row: Array<number>): void
appendRow(row: Array<number>): void
insertRow(index: number, row: Array<number>): void
removeFirst(): void
removeLast(): void
deleteRow(index: number): void
clone(): TSMT$Matrix
sumColumns(): Array<number>
sumRows(): Array<number>
add(matrix: TSMT$Matrix): void
addTo(matrix: TSMT$Matrix): TSMT$Matrix
subtract(matrix: TSMT$Matrix): void
subtractFrom(matrix: TSMT$Matrix): TSMT$Matrix
timesScalar(s: number): void
transpose(): void
transposeInto(): TSMT$Matrix
timesVector(v: Array<number>): Array<number>
multiply(matrix: TSMT$Matrix): void
multiplyInto(matrix: TSMT$Matrix): TSMT$Matrix
solve(b: Array<number>): Array<number>

```


### Usage

A sample usage indicating solution of a linear system of equations is shown below


```
  const matrix: TSMT$Matrix = new TSMT$Matrix();

  matrix.appendRow( [1, -2, -2, -3] );
  matrix.appendRow( [3, -9, 0, -9] );
  matrix.appendRow( [-1, 2, 4, 7] );
  matrix.appendRow( [-3, -6, 26, 2] );

  const solution:Array<number> = __matrix.solve( [1, 1, 1, 1] );
```

Refer to the specs in the _test_ folder for more usage examples.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>

