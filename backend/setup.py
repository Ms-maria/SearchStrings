from setuptools import setup, Extension
import pybind11

setup(
    name="find_module",
    ext_modules=[
        Extension(
            "find_module",
            sources=["FindModule.cpp"],
            include_dirs=[pybind11.get_include()],
            language="c++",
            extra_compile_args=["-std=c++11"],
            extra_link_args=["-static-libgcc", "-static-libstdc++"],
        )
    ],
)