import { useMutation } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueryString } from '@/utils/tools';
import { getAnchorDetail } from '@/api/home';
import VideoList from '@/components/VideoList';
import { API_URL } from '@/common/constants';

const Anchor = () => {
    const navigate = useNavigate();
    const id = getQueryString('id');
    const { mutateAsync: mutateGetAnchorDetail, data } =
        useMutation(getAnchorDetail);

    useEffect(() => {
        if (isEmpty(id)) {
            return navigate('/home');
        } else {
            mutateGetAnchorDetail({ id });
        }
    }, [id, mutateGetAnchorDetail, navigate]);

    return (
        <div className="w-full h-full">
            {data?.data && (
                <div className="flex flex-col items-center">
                    <img
                        className="w-[100px] h-[100px] rounded-full"
                        src={
                            data?.data?.record.cover
                                ? API_URL + data?.data.record.cover
                                : ''
                        }
                    />
                    <span className="text-[18px] mt-[8px]">
                        {data?.data?.record.name}
                    </span>
                </div>
            )}
            <VideoList
                params={{
                    anchorId: id,
                }}
            />
        </div>
    );
};

export default Anchor;
