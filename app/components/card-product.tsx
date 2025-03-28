"use client";
import Image from 'next/image'

export default function CardProduct() {
    return (
        <div className='flex-col justify-center items-center w-fit gap-3 p-2.5'>
            <Image
                src="/Armonia Oval Graytp 8X8.png"
                width={250}
                height={250}
                alt="Armonia Oval Graytp 8X8 Primary Image"
            />
            <div className='flex-col gap-2.5 justify-center items-center'>
                <h3 className='w-[250px]'>Armonia Oval Gray/tp 8X8 Tile</h3>
                <p className='w-[250px]'>$5.62 / sq ft</p>
            </div>
        </div>
    )
}