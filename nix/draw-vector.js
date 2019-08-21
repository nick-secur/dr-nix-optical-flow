const THRESHHOLD = 0;



// function getMagnitude( x0, y0, u, v ) {
//     const a = u-x0,
//           b = v-y0;
//     return( Math.sqrt(a*a + b*b) );
// }

function getMagnitude( u, v ) {
    return( Math.sqrt(u*u + v*v) );
}



// console.log( "TEST M" );
//
// console.log( getMagnitude( 0, 0, 2, 4 ) );
// console.log( getMagnitude( 0, 0, -2, -4 ) );
// console.log( getMagnitude( 0, 0, -2, 4 ) );
// console.log( getMagnitude( 0, 0, 2, -4 ) );
//
// console.log( getMagnitude( 0, 0, 8, -4 ) );
// console.log( getMagnitude( 0, 0, 8, 4 ) );
//
// console.log( "END TEST" );


let cntr = 0;

function drawVector ( ctx, x, y, u, v ) {

    if ( (cntr < 10) && ((getMagnitude(u, v) > 2)) ) {
        console.log( "TEST" );

        console.log( u, v );
        console.log( getMagnitude(u, v) );

        cntr ++;
    }

    if( getMagnitude(u, v) > 2 ) {

        ctx.beginPath();
        ctx.moveTo( x, y );
        ctx.lineTo( x+u, y+v );
        //ctx.arc( x, y, 1, 0, 2 );
        ctx.arc( x, y, 2, 0, 2 );
        ctx.fill();

    }


}

