import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Product } from '@/store/types';
import Image from 'next/image';

type Props = {
  data: Product;
};

const ProductCard = ({ data }: Props) => {
  return (
    <>
      <Card className="min-h-[410px] cursor-pointer justify-between rounded-none pt-0 shadow-xl transition-all duration-200 hover:border-black lg:h-auto">
        <CardHeader className="p-0">
          <div className="">
            <Image
              width={300}
              height={500}
              src={data.image[0]}
              alt={`product's image`}
              className="h-full w-full object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <CardTitle>{data.name}</CardTitle>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center">
            <p className="mb-2 text-[0.9rem] text-red-400">{`${data.price.toLocaleString('vi-VN')} VND`}</p>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default ProductCard;
