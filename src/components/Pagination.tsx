import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onNext?: () => void;
  onPrevious?: () => void;
};

const Pagination = ({ page, total, totalPages, onNext, onPrevious }: Props) => {
  return (
    <>
      <div className="flex w-fit items-center">
        <button
          disabled={page === 1 || total === 0}
          className={`flex items-center p-1 ${page === 1 || total === 0 ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`}
          onClick={onPrevious}
        >
          <ChevronLeft />
        </button>
        <div>
          <span>{total != 0 ? page : 0}</span> of <span>{totalPages}</span>
        </div>
        <button
          disabled={page === totalPages || total === 0}
          className={`flex items-center p-1 ${page === totalPages || total === 0 ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`}
          onClick={onNext}
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
};

export default Pagination;
