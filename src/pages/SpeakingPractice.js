const startCamera = async () => {
  try {
    // 기존 스트림이 있다면 정리
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }

    // 새로운 스트림 시작
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user"
      },
      audio: true
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    return stream;
  } catch (error) {
    console.error('카메라 시작 오류:', error);
    if (error.name === 'NotAllowedError') {
      alert('카메라와 마이크 사용 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.');
    } else if (error.name === 'NotReadableError') {
      alert('카메라를 시작할 수 없습니다. 다른 앱이 카메라를 사용 중인지 확인하거나, 페이지를 새로고침 해주세요.');
    } else {
      alert('카메라 시작 중 오류가 발생했습니다: ' + error.message);
    }
    throw error;
  }
}; 