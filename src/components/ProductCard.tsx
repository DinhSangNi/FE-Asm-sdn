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
      <Card className="h-[450px] cursor-pointer justify-between rounded-none pt-0 shadow-xl transition-all duration-200 hover:border-black">
        <CardHeader className="p-0">
          <div className="">
            <Image
              width={480}
              height={480}
              src={data.image[0]}
              alt={`product's image`}
              className="h-[330px] w-full object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <CardTitle className="line-clamp-1">{data.name}</CardTitle>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center">
            <p className="text-[0.9rem] text-red-400">{`${data.price.toLocaleString('vi-VN')} VND`}</p>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default ProductCard;
