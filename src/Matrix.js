"use strict";
/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Typescript Math Toolkit: A simple matrix class for dealing with dense matrices containing numerical data and of modest
 * size (for typical online and device-based applications).  Note that on construction, the matrix is 0 x 0 and data is
 * undefined.  Add or delete rows to fill the matrix, in which case the column count is determined by the maximum row
 * array length.  If any operation attempts to access row data beyond bounds, that data will be undefined.  The caller
 * is responsible for maintaining proper length in each input row array.
 *
 * LU Factorization is lazy; the factorization will only be recomputed if matrix data changes.
 *
 * Note: Internal matrix storage is row-major
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
var TSMT$Matrix = (function () {
    // setting or operation invalidates a prior factorization
    /**
     * Construct a new Matrix class
     *
     * @returns {nothing} A new (empty) matrix is created
     */
    function TSMT$Matrix() {
        this._n = 0; // column count
        this._n = 0;
        this._matrix = new Array();
        this._indx = new Array();
        this._factorized = false;
    }
    /**
     * Overwrite the current matrix with an array of (row) arrays.
     *
     * @param {Array<Array<number>>} matrix New matrix that will overwrite the current matrix, row by row
     *
     * @returns {nothing}
     */
    TSMT$Matrix.prototype.fromArray = function (matrix) {
        this.clear();
        var n = matrix.length;
        var i;
        for (i = 0; i < n; ++i) {
            this.appendRow(matrix[i]);
        }
    };
    Object.defineProperty(TSMT$Matrix.prototype, "factorized", {
        /**
         * Convenience accessor to determine whether or not the current matrix has been factorized
         *
         * returns {boolean} True if the the matrix has been LU factorized, false otherwise.
         */
        get: function () {
            return this._factorized;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Matrix.prototype, "m", {
        /**
         * Access the current row count
         *
         * @returns {number}
         */
        get: function () {
            return this._matrix.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$Matrix.prototype, "n", {
        /**
         * Access the current column count
         *
         * @returns {number}
         */
        get: function () {
            return this._n;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Access a row of the matrix
     *
     * @param {number} index Row index of the matrix
     *
     * @return {Array<number>} A copy of the requested matrix row or an empty array if the index is out of range
     */
    TSMT$Matrix.prototype.getRow = function (index) {
        if (index >= 0 && index < this._matrix.length) {
            return this._matrix[index].slice();
        }
        else {
            return new Array();
        }
    };
    /**
     * Access a column of the matrix
     *
     * @param {number} index Column index of the matrix
     *
     * @returns {Array<number>} A copy of the requested matrix column or an empty array if the index is out of range
     */
    TSMT$Matrix.prototype.getColumn = function (index) {
        var arr = new Array();
        var m = this._matrix.length;
        var i;
        var row;
        if (index >= 0 && index < this._n) {
            for (i = 0; i < m; ++i) {
                row = this._matrix[i];
                arr.push(row[index]);
            }
        }
        return arr;
    };
    /**
     * Clear the current matrix and prepare it to accept new data
     *
     * @returns {nothing}
     */
    TSMT$Matrix.prototype.clear = function () {
        this._matrix.length = 0;
        this._n = 0;
        this._factorized = false;
    };
    /**
     * Add a row to the top of the matrix
     *
     * @param {Array<number>} row Row array
     *
     * @returns nothing - The row is added at the top of the matrix.  It is the caller's responsibility for data
     * integrity, including consistent column count for each row added to the matrix; the row will not be auto-filled, f
     * or example.
     */
    TSMT$Matrix.prototype.addRow = function (row) {
        if (row !== undefined && row instanceof Array) {
            this._matrix.unshift(row.slice());
            this._n = Math.max(this._n, row.length);
            this._factorized = false;
        }
    };
    /**
     * Append a row to the matrix
     *
     * @param {Array<number>} row Row array
     *
     * @returns {nothing} The row is added to the bottom of the matrix.  It is the caller's responsibility for data
     * integrity, including consistent column count for each row added to the matrix
     */
    TSMT$Matrix.prototype.appendRow = function (row) {
        if (row !== undefined && row instanceof Array) {
            this._matrix.push(row.slice());
            this._n = Math.max(this._n, row.length);
            this._factorized = false;
        }
    };
    /**
     * Insert a row into the matrix
     *
     * @param {number} index Row index (zero-based), which must be between zero and the current row count minus one.
     *
     * @param {Array<number>} row Row Array
     *
     * @returns {nothing} The row is added at specified index in the matrix.  It is the caller's responsibility for
     * data integrity, including consistent column count for each row added to the matrix
     */
    TSMT$Matrix.prototype.insertRow = function (index, row) {
        if (index >= 0 && index < this._matrix.length) {
            if (row) {
                this._matrix.splice(index, 0, row.slice());
                this._n = Math.max(this.n, row.length);
                this._factorized = false;
            }
        }
    };
    /**
     * Remove the first row of the matrix
     *
     * @returns {nothing} The first row of the matrix is removed.
     */
    TSMT$Matrix.prototype.removeFirst = function () {
        if (this._matrix.length > 0) {
            this._matrix.shift();
            this._factorized = true;
        }
    };
    /**
     * Remove the last row of the matrix
     *
     * @returns {nothing} The last row of the matrix is removed.
     */
    TSMT$Matrix.prototype.removeLast = function () {
        if (this._matrix.length > 0) {
            this._matrix.pop();
        }
    };
    /**
     * Delete a row from an arbitrary index in the matrix
     *
     * @param {number} index  Row index (zero-based), which must be between zero and the current row count minus one.
     *
     * @returns {nothing} The row is deleted from the specified row index.
     */
    TSMT$Matrix.prototype.deleteRow = function (index) {
        if (index >= 0 && index < this._matrix.length) {
            this._matrix.splice(index, 1);
            this._factorized = false;
        }
    };
    /**
     * Clone the current matrix
     *
     * @return Matrix - A clone of the current matrix
     */
    TSMT$Matrix.prototype.clone = function () {
        var t = new TSMT$Matrix();
        var m = this.m;
        var i;
        for (i = 0; i < m; ++i) {
            t.appendRow(this._matrix[i]);
        }
        return t;
    };
    /**
     * Sum the columns of the current matrix
     *
     * @returns {Array<number>} Sum of each column of the current matrix
     */
    TSMT$Matrix.prototype.sumColumns = function () {
        var m = this.m;
        if (m == 0) {
            return new Array();
        }
        var n = this._matrix[0].length;
        if (n == 0) {
            return new Array();
        }
        var i;
        var j;
        var row;
        var sum = this._matrix[0].slice();
        for (i = 1; i < m; ++i) {
            row = this._matrix[i];
            for (j = 0; j < n; ++j) {
                sum[j] += row[j];
            }
        }
        return sum;
    };
    /**
     * Sum the rows of the current matrix
     *
     * @returns {Array<number>} Sum of each row of the current matrix
     */
    TSMT$Matrix.prototype.sumRows = function () {
        var m = this.m;
        if (m == 0) {
            return new Array();
        }
        var n = this._matrix[0].length;
        if (n == 0) {
            return new Array();
        }
        var i;
        var row;
        var sum = new Array();
        for (i = 1; i < m; ++i) {
            row = this._matrix[i];
            // this is not as efficient as a straight loop, so it could be optimized if performance becomes an issue
            sum[i] = row.reduce(function (sum, current) { return sum + current; }, 0);
        }
        return sum;
    };
    /**
     * Add a matrix to the current matrix and overwrite the current elements
     *
     * @param {TSMT$Matrix} m Matrix to be added to the current Matrix
     *
     * @returns {nothing} The current matrix is overwritten with the element-wise sum of the current and input matrices.
     * The current matrix is unchanged if the input matrix dimensions do not match the current matrix dimensions
     */
    TSMT$Matrix.prototype.add = function (matrix) {
        if (!matrix || matrix.m != this._matrix.length || matrix.n != this._n) {
            return;
        }
        var m = this._matrix.length;
        var i;
        var j;
        var row;
        var inputRow;
        for (i = 0; i < m; ++i) {
            row = this._matrix[i];
            inputRow = matrix.getRow(i);
            for (j = 0; j < this._n; ++j) {
                row[j] += inputRow[j];
            }
        }
        this._factorized = false;
    };
    /**
     * Add a matrix to the current matrix and return the result in a new Matrix
     *
     * @param {TSMT$Matrix} m Matrix to be added to the current Matrix
     *
     * @returns {TSMT$Matrix} A new Matrix with the element-wise sum of the current and input matrices.  The return is
     * null if the input matrix dimensions do not match the current matrix dimensions
     */
    TSMT$Matrix.prototype.addTo = function (matrix) {
        if (!matrix || matrix.m != this._matrix.length || matrix.n != this._n) {
            return null;
        }
        var theMatrix = this.clone();
        theMatrix.add(matrix);
        return theMatrix; // yes, it has you ...
    };
    /**
     * Subtract a matrix from the current matrix and overwrite the current elements
     *
     * @param {TSMT$Matrox} m Matrix to be subtracted from the current Matrix
     *
     * @returns {nothing} The current matrix is overwritten with the element-wise subtraction of the current and input
     * matrices (i.e. a <- a-b).  The current matrix is unchanged if the input matrix dimensions do not match the current
     * matrix dimensions
     */
    TSMT$Matrix.prototype.subtract = function (matrix) {
        if (!matrix || matrix.m != this._matrix.length || matrix.n != this._n) {
            return;
        }
        var m = this._matrix.length;
        var i;
        var j;
        var row;
        var inputRow;
        for (i = 0; i < m; ++i) {
            row = this._matrix[i];
            inputRow = matrix.getRow(i);
            for (j = 0; j < this._n; ++j) {
                row[j] = row[j] - inputRow[j];
            }
        }
        this._factorized = false;
    };
    /**
     * Subtract a matrix from the current matrix and return the result in a new Matrix
     *
     * @param {TSMT$Matrix} m Matrix to be subtracted from the current Matrix
     *
     * @returns {TSMT$Matrix} A new Matrix with the element-wise subtraction of the current and input matrices,
     * i.e. c = a - b.  The return is null if the input matrix dimensions do not match the  current matrix dimensions
     */
    TSMT$Matrix.prototype.subtractFrom = function (matrix) {
        if (matrix.m != this._matrix.length || matrix.n != this._n) {
            return null;
        }
        var theMatrix = this.clone();
        theMatrix.subtract(matrix);
        return theMatrix; // yes, it has you
    };
    /**
     * Multiply the current matrix by a scalar and overwrite the elements
     *
     * @param {number} s Scalar for element-wise multiplication
     *
     * @returns {nothing} The current matrix is overwritten with the element-wise multiplication by the input scalar.
     * The current matrix is unchanged if the scalar is invalid.  Note that overflow is still possible for a sufficiently
     * large scalar value and matrix elements.
     */
    TSMT$Matrix.prototype.timesScalar = function (s) {
        if (isNaN(s) || !isFinite(s)) {
            return;
        }
        var m = this._matrix.length;
        var i;
        var j;
        var row;
        for (i = 0; i < m; ++i) {
            row = this._matrix[i];
            for (j = 0; j < this._n; ++j) {
                row[j] = s * row[j];
            }
        }
        this._factorized = false;
    };
    /**
     * Transpose the current matrix (in-place)
     *
     * @returns {nothing} The current matrix is transposed in-place, which transforms an m x n matrix into a n x m matrix.
     */
    TSMT$Matrix.prototype.transpose = function () {
        var temp = this.clone();
        var m = this._n; // new number of rows
        var n = this.m; // new number of columns
        var i;
        var col;
        this.clear();
        for (i = 0; i < m; ++i) {
            col = temp.getColumn(i);
            this.appendRow(col);
        }
        this._n = n;
        this._factorized = false;
    };
    /**
     * Return the transpose of the current matrix
     *
     * @returns {TSMT$Matrix} Transpose of the current matrix
     */
    TSMT$Matrix.prototype.transposeInto = function () {
        var t = this.clone();
        t.transpose();
        return t;
    };
    /**
     * Multiply the current matrix by a vector and return the result in an Array
     *
     * @param {Array<number>} v Input vector whose length matches the number of columns in the current array
     *
     * @returns {Array<number>} If the current matrix is A and the input vector is v (A is m x n and v is n x 1) then
     * the return is the matrix-vector product, Av.  If v contains less than n items, the return array is empty.
     * If it contains more than n items, the excess number is ignored.
     */
    TSMT$Matrix.prototype.timesVector = function (v) {
        if (v === undefined || v == null || Object.prototype.toString.call(v) != '[object Array]') {
            return new Array();
        }
        if (v.length < this._n) {
            return new Array();
        }
        var m = this._matrix.length;
        var i;
        var j;
        var row;
        var s;
        var r = new Array();
        for (i = 0; i < m; ++i) {
            row = this._matrix[i];
            s = 0;
            for (j = 0; j < this._n; ++j) {
                s += row[j] * v[j];
            }
            r[i] = s;
        }
        return r;
    };
    /**
     * Multiply the current matrix by another matrix and store the result in the current matrix
     *
     * @param {TSMT$Matrix} m Input Matrix to be multiplied by the current matrix
     *
     * @returns {nothing} The matrices must be of appropriate dimensions for the multiplication.  If the current matrix
     * is m x n, the input matrix must be n x p and the result will be a new, m x p matrix.  There is little error-checking
     * for performance reasons - the current matrix is unchanged if the operation is not defined.
     */
    TSMT$Matrix.prototype.multiply = function (matrix) {
        if (!matrix || this._n != matrix.m) {
            return;
        }
        var t = this.clone();
        var m = this._matrix.length;
        var p = matrix.n;
        var i;
        var j;
        var k;
        var row;
        var column;
        var s;
        this._matrix.length = 0;
        for (i = 0; i < m; ++i) {
            this._matrix.push(new Array());
        }
        for (i = 0; i < m; ++i) {
            row = t.getRow(i);
            for (j = 0; j < p; ++j) {
                s = 0.0;
                column = matrix.getColumn(j);
                for (k = 0; k < this._n; ++k) {
                    s += row[k] * column[k];
                }
                this._matrix[i][j] = s;
            }
        }
        this._n = p;
        this._factorized = false;
    };
    /**
     * Multiply the current matrix by another matrix and store the result in a new Matrix
     *
     * @param {TSMT$Matrix} m Input Matrix to be multiplied by the current Matrix
     *
     * @returns {TSMT$Matrix} The matrices must be of appropriate dimensions for the multiplication.  If the current
     * matrix is m x n, the input matrix must be n x p and the result will be a new, m x p matrix.  A new 0x0 Matrix is
     * returned if the operationis not defined.
     */
    TSMT$Matrix.prototype.multiplyInto = function (matrix) {
        if (!matrix || this._n != matrix.m) {
            return new TSMT$Matrix();
        }
        var t = this.clone();
        t.multiply(matrix);
        return t;
    };
    /**
     * Solve a linear system of equations, Ax = b with the current matrix being a n x n coefficient matrix
     *
     * @param {Array<number>} b Right-hand side vector
     *
     * @returns {Array<number>} Solution vector or empty array if the current matrix is not square, empty, or obviously
     * singular. Note that the current matrix will be overwritten by its LU factorization.  There is no error-checking on
     * inputs for performance reasons.
     *
     * This method may be called multiple times with different right-hand sides and the matrix will be factorized only
     * once. Clone the current matrix if you wish to use the original matrix again after solution.
     */
    TSMT$Matrix.prototype.solve = function (b) {
        var status = !this._factorized ? this.__LU() : 0;
        if (status == 0) {
            var x = b.slice();
            return this.__solve(x);
        }
        else {
            return new Array();
        }
    };
    // internal method - compute LU factorization (overwrites current matrix)
    TSMT$Matrix.prototype.__LU = function () {
        if (this._matrix.length != this._n) {
            return;
        }
        var n = this._n;
        if (n == 0) {
            return;
        }
        var small = 0.0000001;
        var i;
        var j;
        var k;
        var imax; // think result from Linpack IDAMAX
        var b;
        var temp;
        var z;
        // reset pivots
        this._indx.length = 0;
        // factor w/partial pivoting
        for (k = 0; k < n; ++k) {
            // get pivot row
            b = 0.0;
            imax = k;
            for (i = k; i < n; ++i) {
                temp = Math.abs(this._matrix[i][k]);
                if (temp > b) {
                    b = temp;
                    imax = i;
                }
            }
            // interchange rows
            if (k != imax) {
                for (j = 0; j < n; ++j) {
                    temp = this._matrix[imax][j];
                    this._matrix[imax][j] = this._matrix[k][j];
                    this._matrix[k][j] = temp;
                }
            }
            this._indx[k] = imax;
            if (Math.abs(this._matrix[k][k]) < 0.000000001) {
                this._matrix[k][k] = small;
            }
            z = 1.0 / this._matrix[k][k];
            // rank-1 update of sub-matrix
            if (k + 1 < n) {
                for (i = k + 1; i < n; ++i) {
                    this._matrix[i][k] *= z;
                    temp = this._matrix[i][k];
                    for (j = k + 1; j < n; ++j)
                        this._matrix[i][j] -= temp * this._matrix[k][j];
                }
            }
        }
        this._factorized = true;
        return 0;
    };
    // given A = LU, A^-1x = (LU)^-1 x or U^-1 L^-1 x - solve Ly = x for y and then Ux = y for x
    TSMT$Matrix.prototype.__solve = function (x) {
        var n = this._matrix.length;
        var i;
        var j;
        var ii = 0;
        var ip;
        var sum;
        for (i = 0; i < n; ++i) {
            ip = this._indx[i];
            sum = x[ip];
            x[ip] = x[i];
            if (ii != 0) {
                for (j = ii - 1; j < i; ++j) {
                    sum -= this._matrix[i][j] * x[j];
                }
            }
            else if (sum != 0.0) {
                ii = i + 1;
            }
            x[i] = sum;
        }
        for (i = n - 1; i >= 0; i--) {
            sum = x[i];
            for (j = i + 1; j < n; j++) {
                sum -= this._matrix[i][j] * x[j];
            }
            x[i] = sum / this._matrix[i][i];
        }
        return x;
    };
    return TSMT$Matrix;
}());
exports.TSMT$Matrix = TSMT$Matrix;
