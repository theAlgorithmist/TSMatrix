/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

// Specs for alpha release of TSMT Matrix
import {TSMT$Matrix} from '../src/Matrix';

// compare two vectors (array of numbers) against the specified relative error
const __vectorCompare: Function = function(vector1:Array<number>, vector2:Array<number>, epsilon:number=0.01): boolean
{
  var n1:number = vector1.length;
  var n2:number = vector2.length;

  if( n1 != n2 )
    return false;

  var i:number;
  var v:number;

  for (i=0; i<n1; ++i )
  {
    v = Math.abs( (vector1[i]-vector2[i])/vector1[i] );
    if( v > epsilon )
      return false;
  }

  return true;
}

// compare two matrices, elementwise against the specified relative error
const __matrixCompare: Function = function(matrix1:TSMT$Matrix, matrix2:TSMT$Matrix, epsilon:number=0.01): boolean
{
  // compare dimensions
  var m1:number = matrix1.m;
  var n1:number = matrix1.n;
  var m2:number = matrix2.m;
  var n2:number = matrix2.n;

  if( m1 != m2 || n1 != n2 )
    return false;

  var i:number;
  var row1:Array<number>;
  var row2:Array<number>;

  // row-wise compare
  for( i=0; i<m1; ++i )
  {
    row1 = matrix1.getRow(i);
    row2 = matrix2.getRow(i);

    if( row1.length != row2.length )
      return false;

    if( !__vectorCompare(row1, row2, epsilon) )
      return false;
  }

  return true;
}

import * as Chai from 'chai';
const expect = Chai.expect;

// Test Suites
describe('The Matrix has you', () => {

  var __matrix: TSMT$Matrix = new TSMT$Matrix();   // dense matrix
  var matrix: TSMT$Matrix   = new TSMT$Matrix();
  var _matrix:Array<Array<number>> = new Array<Array<number>>();

  // old-school
  _matrix.push( [1,2,3] );
  _matrix.push( [3,4,5] );
  _matrix.push( [5,7,8] );

  var m:number;
  var n:number;
  var x: Array<number>;
  var b: Array<number>;

  it('new matrix has dimensions 0x0', function() {
    expect(__matrix.m).to.equal(0);
    expect(__matrix.n).to.equal(0);
  });

  it('creates a new matrix from an array of arrays', function() {
    __matrix.fromArray(_matrix);

    expect(__matrix.m).to.equal(3);
    expect(__matrix.n).to.equal(3);

    var row:Array<number> = __matrix.getRow(1);
    expect(__vectorCompare(row, _matrix[1])).to.be.true;
  });

  it('fetches a column from an existing matrix', function() {
    var col:Array<number> = __matrix.getColumn(2);

    expect(__vectorCompare(col, [3,5,8])).to.be.true;
  });

  it('returns empty array for fetching invalid row index', function() {
    var row:Array<number> = __matrix.getRow(5);

    expect(row.length).to.equal(0);
  });

  it('properly clears the matrix', function() {
    __matrix.clear();

    expect(__matrix.m).to.equal(0);
    expect(__matrix.n).to.equal(0);
  });

  it('properly appends rows to end of the matrix', function() {
    __matrix.addRow( [1,2,3] );
    __matrix.appendRow( [4,5,6] );

    expect(__matrix.m).to.equal(2);
    expect(__matrix.n).to.equal(3);

    var row = __matrix.getRow(0);
    expect(__vectorCompare(row, [1,2,3])).to.be.true;
  });

  it('properly adds rows to beginning of the matrix', function() {
    __matrix.addRow( [-1,-2,-3] );

    expect(__matrix.m).to.equal(3);
    expect(__matrix.n).to.equal(3);

    var row: Array<number> = __matrix.getRow(2);

    expect(__vectorCompare(row, [4,5,6])).to.be.true;
  });

  it('properly inserts a row into the matrix', function() {
    __matrix.insertRow( 1, [0,0,0] );

    expect(__matrix.m).to.equal(4);
    expect(__matrix.n).to.equal(3);

    var row: Array<number> = __matrix.getRow(0);
    expect(__vectorCompare(row, [-1,-2,-3])).to.be.true;

    var row: Array<number> = __matrix.getRow(1);
    expect(__vectorCompare(row, [0,0,0])).to.be.true;

    row = __matrix.getRow(2);
    expect(__vectorCompare(row, [1,2,3])).to.be.true;
  });

  it('properly removes first and last rows from the matrix', function() {
    __matrix.removeFirst();
    __matrix.removeLast();

    expect(__matrix.m).to.equal(2);
    expect(__matrix.n).to.equal(3);

    var row: Array<number> = __matrix.getRow(0);
    expect(__vectorCompare(row, [0,0,0])).to.be.true;
  });

  it('properly deletes a row from the matrix', function() {
    __matrix.deleteRow(0);

    expect(__matrix.m).to.equal(1);
    expect(__matrix.n).to.equal(3);

    var row: Array<number> = __matrix.getRow(0);
    expect(__vectorCompare(row, [1,2,3])).to.be.true;
  });

  it('correctly clones a matrix', function() {
    __matrix.clear();

    __matrix.appendRow( [1, -2, -2, -3] );
    __matrix.appendRow( [3, -9, 0, -9] );
    __matrix.appendRow( [-1, 2, 4, 7] );
    __matrix.appendRow( [-3, -6, 26, 2] );

    matrix = __matrix.clone();
    expect(__matrixCompare(matrix, __matrix)).to.be.true;
  });

  it('correctly adds a matrix in-place', function() {
    __matrix.add( matrix );

    matrix.clear();

    matrix.appendRow( [2, -4, -4, -6] );
    matrix.appendRow( [6, -18, 0, -18] );
    matrix.appendRow( [-2, 4, 8, 14] );
    matrix.appendRow( [-6, -12, 52, 4] );

    expect(__matrixCompare(matrix, __matrix)).to.be.true;
  });

  it('correctly adds a matrix and returns another matrix', function() {
    matrix.clear();

    matrix.appendRow( [-2, 4, 4, 6] );
    matrix.appendRow( [-6, 18, 0, 18] );
    matrix.appendRow( [2, -4, -8, -14] );
    matrix.appendRow( [6, 12, -52, -4] );

    var newMatrix:TSMT$Matrix = __matrix.addTo( matrix );

    matrix.clear();

    matrix.appendRow( [0, 0, 0, 0] );
    matrix.appendRow( [0, 0, 0, 0] );
    matrix.appendRow( [0, 0, 0, 0] );
    matrix.appendRow( [0, 0, 0, 0] );

    expect(__matrixCompare(newMatrix, matrix)).to.be.true;
  });

  it('correctly multiplies by scalar & subtracts a matrix in-place', function() {
    __matrix.clear();
    matrix.clear();

    matrix.appendRow( [1, 2, 3, 4] );
    matrix.appendRow( [5, 6, 7, 8] );
    matrix.appendRow( [9, 10, 11, 12] );
    matrix.appendRow( [13, 14, 15, 16] );

    __matrix = matrix.clone();
    __matrix.timesScalar(2.0);
    __matrix.subtract(matrix);

    expect(__matrixCompare(matrix, __matrix)).to.be.true;
  });

  it('correctly deletes row and transposes matrix', function() {
    __matrix.deleteRow(3);
    __matrix.transpose();

    expect( __matrix.m ).to.equal(4);
    expect( __matrix.n ).to.equal(3);

    matrix.clear();
    matrix.appendRow( [1, 5, 9] );
    matrix.appendRow( [2, 6, 10] );
    matrix.appendRow( [3, 7, 11] );
    matrix.appendRow( [4, 8, 12] );

    // this one also test that the class is correctly preserving immutability when building matrices from other matrices and arrays
    expect(__matrixCompare(matrix, __matrix)).to.be.true;
  });

  it('correctly multiplies a matrix times a vector', function() {
    __matrix.clear();

    __matrix.appendRow( [1, 2, 3] );
    __matrix.appendRow( [4, 5, 6] );
    __matrix.appendRow( [7, 8, 9] );
    __matrix.appendRow( [10, 11, 12] );

    var result:Array<number> = __matrix.timesVector( [-2, 1, 0] );

    expect(__vectorCompare(result, [0, -3, -6, -9])).to.be.true;
  });

  it('correctly multiplies a matrix times another matrix', function() {
    __matrix.clear();
    matrix.clear();

    __matrix.appendRow( [1, 3, 5, 7] );
    __matrix.appendRow( [2, 4, 6, 8] );

    matrix.appendRow( [1, 8, 9] );
    matrix.appendRow( [2, 7, 10] );
    matrix.appendRow( [3, 6, 11] );
    matrix.appendRow( [4, 5, 12] );

    __matrix.multiply(matrix);

    matrix.clear();
    matrix.appendRow( [50, 94, 178] );
    matrix.appendRow( [60, 120, 220] );

    expect(__matrixCompare(__matrix, matrix)).to.be.true;
  });

  it('returns empty matrix for incorrect multiplication', function() {
    __matrix.clear();
    matrix.clear();

    __matrix.appendRow( [1, 3, 5] );
    __matrix.appendRow( [2, 4, 6] );
    __matrix.appendRow( [-1, 4, 3] );

    matrix.appendRow( [1, 8, 9] );
    matrix.appendRow( [2, 7, 10] );
    matrix.appendRow( [3, 6, 11] );
    matrix.appendRow( [4, 5, 12] );

    var t:TSMT$Matrix = __matrix.multiplyInto(matrix);

    expect(t.m).to.equal(0);
    expect(t.n).to.equal(0);
  });

  it('correctly sums matrix columns', function() {
    __matrix.clear();

    __matrix.appendRow( [1, 3, 5] );
    __matrix.appendRow( [2, 4, 6] );
    __matrix.appendRow( [-1, 4, 3] );

    const sum: Array<number> = __matrix.sumColumns();

    expect(__vectorCompare(sum, [2, 11, 14])).to.be.true;
  });

  it('correctly sums matrix rows', function() {
    __matrix.clear();

    __matrix.appendRow( [1, 3, 5] );
    __matrix.appendRow( [2, 4, 6] );
    __matrix.appendRow( [-1, 4, 3] );

    const sum: Array<number> = __matrix.sumRows();

    expect(__vectorCompare(sum, [9, 12, 6])).to.be.true;
  });

  it('correctly LU factors and solves a system of equations', function() {
    __matrix.clear();

    __matrix.appendRow( [1, -2, -2, -3] );
    __matrix.appendRow( [3, -9, 0, -9] );
    __matrix.appendRow( [-1, 2, 4, 7] );
    __matrix.appendRow( [-3, -6, 26, 2] );

    expect(__matrix.factorized).to.be.false;
    const solution:Array<number> = __matrix.solve( [1, 1, 1, 1] );
    expect(__matrix.factorized).to.be.true;

    __matrix.clear();

    __matrix.appendRow( [1, -2, -2, -3] );
    __matrix.appendRow( [3, -9, 0, -9] );
    __matrix.appendRow( [-1, 2, 4, 7] );
    __matrix.appendRow( [-3, -6, 26, 2] );

    expect(__matrix.factorized).to.be.false;

    const check:Array<number> = __matrix.timesVector(solution);

    expect(__vectorCompare(check, [1,1,1,1])).to.be.true;
  });
});